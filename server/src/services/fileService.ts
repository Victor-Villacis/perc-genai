import fs from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar';
import { UploadedFile } from 'express-fileupload';
import { spawn } from 'child_process';
import { Server as SocketIoServer } from 'socket.io';
import { sendEmail } from './email';
const config = require('../../config.json');

export interface ParsedData {
    [key: string]: any;
}

// Upload and execute with python

export const uploadFile = async (uploadedFile: UploadedFile, io: SocketIoServer): Promise<void> => {
    const savePath = path.join(__dirname, 'input_folder', uploadedFile.name);
    console.log('Saving file to:', savePath);

    try {
        await fs.writeFile(savePath, uploadedFile.data);
        io.emit('fileUploaded', { filename: uploadedFile.name });
        await executePythonScript(io);
    } catch (err) {
        console.error('An error occurred:', err);
        io.emit('uploadError', { message: 'An error occurred while uploading or processing the file.' });
        throw err;
    }
}


const executePythonScript = async (io: SocketIoServer): Promise<void> => {
    const pythonScriptPath = path.resolve(config.pythonScriptsDir, 'mock_processor.py');
    console.log('Executing python script at:', pythonScriptPath);

    try {
        const code = await new Promise<number>((resolve, reject) => {
            const python = spawn('python', [pythonScriptPath]);

            python.stdout.on('data', (data) => {
                console.log('Pipe data from python script:', data.toString());
            });

            python.stderr.on('data', (data) => {
                console.error(`Python script error: ${data}`);
            });

            python.on('close', (code) => {
                if (code !== null) {
                    resolve(code);
                } else {
                    reject(new Error('Process closed with null code'));
                }
            });

            python.on('error', (err) => {
                reject(err);
            });
        });

        if (code === 0) {
            await watchForPythonFiles(io)
        } else {
            throw new Error('Error executing Python script.');
        }
    } catch (err) {
        console.error('An error occurred while executing the Python script:', err);
        io.emit('pythonError', { message: 'An error occurred while executing the Python script.' });
        throw err;
    }
}

const watchForPythonFiles = async (io: SocketIoServer): Promise<void> => {
    return new Promise((resolve, reject) => {
        let pythonDetailedReady = false;
        let pythonOverallReady = false;

        const pythonOutputFolderPath = path.join(__dirname, 'output_folder');
        const pythonWatcher = chokidar.watch(pythonOutputFolderPath);

        pythonWatcher.on('add', (filepath) => {
            const filename = path.basename(filepath);
            if (filename === 'detailed-summary.json') {
                pythonDetailedReady = true;
            }
            if (filename === 'overall-summary.json') {
                pythonOverallReady = true;
            }
            if (pythonDetailedReady && pythonOverallReady) {
                io.emit('fileReady', 'Python');
                resolve();
            }
        });
    });
}

export const getData = async (type: 'detailed' | 'overall', io: SocketIoServer): Promise<ParsedData> => {
    console.log(`Getting ${type} data`);
    const filePath = path.join(__dirname, 'output_folder', `${type}-summary.json`);
    console.log(`Reading ${type} data file from:`, filePath);

    try {
        const data = await fs.readFile(filePath, 'utf8');
        const parsedData: ParsedData = JSON.parse(data);
        io.emit('dataFetched', { type });
        return parsedData;
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error reading or parsing the file from ${filePath}:`, err.message);
            throw new Error(err.message);
        } else {
            console.error('An unknown error occurred:', err);
            throw new Error('An unknown error occurred.');
        }
    }
};

// Write and execute with R

export const writeFile = async (text: string, io: SocketIoServer): Promise<void> => {
    const savePath = path.join(__dirname, 'query_input', 'query.txt');
    console.log('Saving text to:', savePath);

    try {
        await fs.writeFile(savePath, text);
        io.emit('textWritten', { text: text });

        await executeRScript(io);
    } catch (err) {
        console.error('An error occurred:', err);
        io.emit('writeError', { message: 'An error occurred while writing the text.' });
        throw err;
    }
};


export const executeRScript = async (io: SocketIoServer): Promise<void> => {
    const rScriptPath = path.resolve(config.rScriptsDir, 'output.R');
    console.log('Executing R script at:', rScriptPath);

    try {
        const code = await new Promise<number>((resolve, reject) => {
            const rProcess = spawn('Rscript', [rScriptPath]);

            rProcess.stdout.on('data', (data) => {
                console.log('Pipe data from R script:', data.toString());
            });

            rProcess.stderr.on('data', (data) => {
                console.error(`R script error: ${data}`);
            });

            rProcess.on('close', (code) => {
                if (code !== null) {
                    resolve(code);
                } else {
                    reject(new Error('Process closed with null code'));
                }
            });

            rProcess.on('error', (err) => {
                reject(err);
            });
        });

        if (code === 0) {
            await watchForRFiles(io);
        } else {
            throw new Error('Error executing R script.');
        }
    } catch (err) {
        console.error('An error occurred while executing the R script:', err);
        io.emit('rError', { message: 'An error occurred while executing the R script.' });
        throw err;
    }
}

const watchForRFiles = async (io: SocketIoServer): Promise<void> => {
    return new Promise((resolve, reject) => {
        let rOutputReady = false;

        const rOutputFolderPath = path.join(__dirname, 'query_output');
        const rWatcher = chokidar.watch(rOutputFolderPath);

        rWatcher.on('add', (filepath) => {
            const filename = path.basename(filepath);
            if (filename === 'gpt_search_out.json') {
                rOutputReady = true;
            }
            if (rOutputReady) {
                io.emit('fileReady', 'R');
                resolve();
            }
        });
    });
}

export const getAnswerData = async (io: SocketIoServer): Promise<string> => {
    console.log(`Getting GPT answer data`);
    const filePath = path.join(__dirname, 'query_output', 'gpt_search_out.json');
    console.log(`Reading GPT answer data file from:`, filePath);

    try {
        const data = await fs.readFile(filePath, 'utf8');
        const dataArray = JSON.parse(data);
        const processedData = dataArray[0];

        io.emit('answerFetched', {});
        return processedData;
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error reading or parsing the file from ${filePath}:`, err.message);
            throw new Error(err.message);
        } else {
            console.error('An unknown error occurred:', err);
            throw new Error('An unknown error occurred.');
        }
    }
};