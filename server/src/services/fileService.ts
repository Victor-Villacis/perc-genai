import fs from 'fs';
import path from 'path';
import util from 'util';
import { UploadedFile } from 'express-fileupload';
import { spawn } from 'child_process';
import { Server as SocketIoServer } from 'socket.io';
import { ParsedData } from '../models/parsedDataModel';
import { sendEmail } from './email';
import { getIO } from '../server'
const config = require('../../config.json')
// use async await more often

const mvAsync = util.promisify((uploadedFile: UploadedFile, path: string, cb: (err?: Error) => void) => {
    uploadedFile.mv(path, cb);
});


// Function to handle file upload
export const uploadFile = async (uploadedFile: UploadedFile, io: SocketIoServer, userEmail: string): Promise<void> => {
    try {


        const savePath = path.join(__dirname, 'input_folder', uploadedFile.name);
        console.log('Saving file to:', savePath);

        // Use await here
        await mvAsync(uploadedFile, savePath);

        // const doneFilePath = path.join(__dirname, 'input_folder', '.done');
        // await fs.promises.unlink(doneFilePath);  // Delete the .done file

        const pythonScriptPath = path.resolve(config.pythonScriptsDir, 'mock_processor.py');
        console.log('Executing python script at:', pythonScriptPath);

        // Use spawn and handle it asynchronously (this part could be further refined)
        const python = spawn('python', [pythonScriptPath]);

        const onData = (data: any) => console.log('Pipe data from python script:', data.toString());
        const onError = (data: any) => console.error(`Python script error: ${data}`);

        python.stdout.on('data', onData);
        python.stderr.on('data', onError);

        const code = await new Promise<number>((resolve) => {
            python.on('close', resolve);
        });

        console.log(`Python script finished with code ${code}`);
        if (code === 0) {
            io.emit('fileReady', 'Python');
            await sendEmail(userEmail, 'Summary Is Ready', 'The Summary has been parsed successfully and is ready to view.');
        } else {
            await sendEmail(userEmail, 'Summary Uploaded', 'An error occurred while parsing the uploaded file, please try again.');
            throw new Error('Error executing Python script.');
        }
    } catch (err) {
        console.error("Upload File Error:", err);  // Log the error here for debugging
        if (err instanceof Error) {
            console.error(err.message);
            throw err;
        } else {
            console.error('An unknown error occurred:', err);
            throw new Error('An unknown error occurred.');
        }

    }
};


export const readGPTSearchFile = async (): Promise<string[]> => {
    const filePath = path.join(__dirname, 'query_output', 'gpt_search_.json');
    console.log('Reading GPT Search file from:', filePath);

    try {
        // Use fs.promises API to read the file
        const data = await fs.promises.readFile(filePath, 'utf8');

        // Parse the JSON data
        const parsedData: string[] = JSON.parse(data);
        return parsedData;
    } catch (err) {
        if (err instanceof Error) {  // Type guard
            console.error(`Error reading or parsing the file from ${filePath}:`, err.message);
            throw new Error(err.message);
        } else {
            console.error('An unknown error occurred:', err);
            throw new Error('An unknown error occurred.');
        }
    }
};


export const handleSearchQuery = async (searchQuery: string): Promise<void> => {
    const queryPath = path.join(__dirname, 'query_input', 'query.txt');
    console.log(searchQuery, 'I am in the function handleSearch');

    try {
        // Use fs.promises API to write the search query to a text file
        await fs.promises.writeFile(queryPath, searchQuery, 'utf8');

        // Trigger the R script
        const rScriptPath = path.resolve(config.RScriptsDir, 'output.R');
        console.log('Executing R script at:', rScriptPath);

        const rScript = spawn('Rscript', [rScriptPath]);

        rScript.stdout.on('data', (data) => {
            console.log('Pipe data from R script:', data.toString());
        });

        rScript.stderr.on('data', (data) => {
            console.error(`R script error: ${data}`);
        });

        // Use a Promise to handle the 'close' event
        await new Promise<void>((resolve, reject) => {
            rScript.on('close', (code) => {
                console.log(`R script finished with code ${code}`);
                if (code === 0) {
                    resolve();
                } else {
                    reject('Error executing R script.');
                }
            });
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Error:', err.message);
            throw new Error(err.message);
        } else {
            console.error('An unknown error occurred:', err);
            throw new Error('An unknown error occurred.');
        }
    }
};

// Function to read data based on type (detailed or overall)
export const getData = async (type: 'detailed' | 'overall'): Promise<ParsedData> => {
    const filePath = path.join(__dirname, 'output_folder', `${type}-summary.json`);
    console.log(`Reading ${type} data file from:`, filePath);

    try {
        // Use fs.promises API to read the file
        const data = await fs.promises.readFile(filePath, 'utf8');

        // Parse the JSON data
        const parsedData: ParsedData = JSON.parse(data);
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



export const watchForDoneFiles = async (io: SocketIoServer) => {
    const pythonOutputFolderPath = path.join(__dirname, 'output_folder');
    const rOutputFolderPath = path.join(__dirname, 'query_output');

    try {
        // Watch for Python .done files
        fs.watch(pythonOutputFolderPath, async (event, filename) => {
            if (filename === '.done') {
                // const doneFilePath = path.join(pythonOutputFolderPath, '.done');
                // await fs.promises.unlink(doneFilePath);  // Delete the .done file

                console.log('.done file detected in python_output_folder');
                io.emit('fileReady', 'Python'); // Emit Python-specific event
            }
        });

        // Watch for R .done files
        fs.watch(rOutputFolderPath, async (event, filename) => {
            if (filename === '.done') {
                // const doneFilePath = path.join(rOutputFolderPath, '.done');
                // await fs.promises.unlink(doneFilePath);  // Delete the .done file

                console.log('.done file detected in r_output_folder');
                io.emit('fileReady', 'R'); // Emit R-specific event
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error setting up file watchers: ${error.message}`);
        } else {
            console.error(`An unknown error occurred: ${error}`);
        }
    }
};


export const watchFolders = (io: SocketIoServer) => {
    const queryOutputPath = path.join(__dirname, 'query_output');
    const outputFolderPath = path.join(__dirname, 'output_folder');

    // Watch query_output folder
    fs.watch(outputFolderPath, async (event, filename) => {
        if (event === 'rename') {
            console.log(`File ${filename} has been added to the output_folder`);
            io.emit('summaryOutputReady', filename);
        }
    });
};

