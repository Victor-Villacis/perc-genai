import fs from 'fs';
import path from 'path';
import { UploadedFile } from 'express-fileupload';
import { spawn } from 'child_process';
import { Server as SocketIoServer } from 'socket.io';
import { ParsedData } from '../models/parsedDataModel';
import { sendEmail } from './email';
const config = require('../../config.json')



// Function to read data based on type (detailed or overall)
export const getData = async (type: 'detailed' | 'overall'): Promise<ParsedData> => {
    console.log(`Getting ${type} data`);
    const filePath = path.join(__dirname, 'output_folder', `${type}-summary.txt`);
    console.log('Reading file from:', filePath);
    const parsedData: ParsedData = {};

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading the file from ${filePath}:`, err);
                reject('Error reading the file: ' + err.message);
                return;
            }

            const lines = data.split('\n');
            let currentSection = '';
            let currentSubsection = '';

            lines.forEach((line: string) => {
                if (!line.trim()) return;

                const indentation = line.search(/\S/);

                if (indentation === 0) {
                    currentSection = line.trim();
                    parsedData[currentSection] = {};
                } else if (indentation === 5) {
                    currentSubsection = line.trim();
                    parsedData[currentSection][currentSubsection] = {};
                } else if (indentation === 10) {
                    if (line.includes(': ')) {
                        const [key, value] = line.trim().split(': ');
                        parsedData[currentSection][currentSubsection][key] = value;
                    }
                }
            });

            resolve(parsedData);
        });
    });
};
// Function to handle file upload
export const uploadFile = async (uploadedFile: UploadedFile, io: SocketIoServer, userEmail: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const savePath = path.join(__dirname, 'input_folder', uploadedFile.name);
        console.log('Saving file to:', savePath);

        uploadedFile.mv(savePath, (err) => {
            if (err) {
                console.error('Error saving the file:', err);
                reject('Error saving the file: ' + err.message);
                return;
            }


            const pythonScriptPath = path.resolve(config.pythonScriptsDir, 'mock_processor.py');
            console.log('Executing python script at:', pythonScriptPath);

            const python = spawn('python', [pythonScriptPath]);

            python.stdout.on('data', (data) => {
                console.log('Pipe data from python script:', data.toString());
            });

            python.stderr.on('data', (data) => {
                console.error(`Python script error: ${data}`);
            });

            python.on('close', async (code) => {
                console.log(`Python script finished with code ${code}`);
                if (code === 0) {
                    io.emit('fileReady');
                    await sendEmail(userEmail, 'Summary Is Ready', 'The Summary has been parsed successfully and is ready to view.');
                    resolve();
                } else {
                    await sendEmail(userEmail, 'Summary Uploaded', 'An error occurred while parsing the uploaded file, please try again.');
                    reject('Error executing Python script.');
                }
            });
        });
    });
};

