import e, { Request, Response } from 'express';
import { uploadFile } from '../services/fileService';
import { getData } from '../services/fileService';
import { sendEmail } from '../services/email'; // Update this import path to point to your actual email file where sendEmail function resides.

import { UploadedFile } from 'express-fileupload';
import { Server as SocketIoServer } from 'socket.io';

type DataType = 'detailed' | 'overall';

// Controller function to handle request for summary data
export const getSummaryData = async (req: Request, res: Response) => {

    console.log('Get summary data endpoint hit');
    try {
        const type = req.query.type as DataType;

        // Validate the 'type' to be one of the expected values
        if (type !== 'detailed' && type !== 'overall') {
            res.status(400).send('Bad Request: Invalid type parameter');
            return;
        }

        // Invoke service function to get the data based on the type query parameter
        const data = await getData(type);

        // Send the data back as JSON
        res.json(data);
    } catch (err) {
        // Log the error and send a 500 Internal Server Error response
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};



// In your fileController
export const uploadWithIo = (io: SocketIoServer) => {
    console.log('Upload endpoint hit');
    return async (req: Request, res: Response) => {
        console.log('Files:', req.files);  // Log the received files
        try {
            const uploadedFile = req.files?.uploadedFile as UploadedFile;
            const userEmail = req.body?.email as string;
            console.log('email:', userEmail);
            if (!uploadedFile) {
                res.status(400).send('No file uploaded');
                return;
            }
            console.log('Body:', req.body);
            console.log('Uploaded file:', uploadedFile);

            await uploadFile(uploadedFile, io, userEmail);

            console.log('File uploaded and script executed!');
            res.json({ message: 'File uploaded and script executed!' });

        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    };
};


