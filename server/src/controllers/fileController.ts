import e, { Request, Response } from 'express';
import { uploadFile, getData, writeFile, getAnswerData } from '../services/fileService';
import { sendEmail } from '../services/email'; // Update this import path to point to your actual email file where sendEmail function resides.

import { UploadedFile } from 'express-fileupload';
import { Server as SocketIoServer } from 'socket.io';

type DataType = 'detailed' | 'overall';



export const uploadWithIo = (io: SocketIoServer) => {
    console.log('Upload endpoint hit');
    return async (req: Request, res: Response) => {
        console.log('Files:', req.files);
        try {
            const uploadedFile = req.files?.uploadedFile as UploadedFile;
            if (!uploadedFile) {
                res.status(400).send('No file uploaded');
                return;
            }
            console.log('Body:', req.body);
            console.log('Uploaded file:', uploadedFile);

            await uploadFile(uploadedFile, io);

            console.log('File uploaded');
            res.json({ message: 'File uploaded' });

        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    };
};


export const getSummaryData = (io: SocketIoServer) => async (req: Request, res: Response) => {

    console.log('Get summary data endpoint hit');
    try {
        const type = req.query.type as DataType;

        // Validate the 'type' to be one of the expected values
        if (type !== 'detailed' && type !== 'overall') {
            res.status(400).send('Bad Request: Invalid type parameter');
            return;
        }

        // Invoke service function to get the data based on the type query parameter
        const data = await getData(type, io);  // Assuming io is available in this scope


        // Send the data back as JSON
        res.json(data);
    } catch (err) {
        // Log the error and send a 500 Internal Server Error response
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


export const writeWithIo = (io: SocketIoServer) => {
    console.log('Write endpoint hit');
    return async (req: Request, res: Response) => {
        console.log('Body:', req.body);
        try {
            const writtenText = req.body.query;  // Assuming you send the text under the key 'query'
            if (!writtenText) {
                res.status(400).send('No text provided');
                return;
            }

            await writeFile(writtenText, io);  // Write the text to file

            console.log('Text written');
            res.json({ message: 'Text written' });

        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    };
};


export const getGPTAnswer = (io: SocketIoServer) => async (req: Request, res: Response) => {
    console.log('Get GPT answer endpoint hit');
    try {

        const data = await getAnswerData(io);  // Assuming io is available in this scope

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
