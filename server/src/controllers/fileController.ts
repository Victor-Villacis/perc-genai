import { Request, Response } from 'express';
import { uploadFile } from '../services/fileService';
import { getData } from '../services/fileService';

import { UploadedFile } from 'express-fileupload';
import { Server as SocketIoServer } from 'socket.io';

type DataType = 'detailed' | 'overall'; // Define expected types, you may have to adjust this based on your service function

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

            if (!uploadedFile) {
                res.status(400).send('No file uploaded');
                return;
            }
            console.log('Body:', req.body);  // Log the body
            await uploadFile(uploadedFile, io);
            console.log('File uploaded and script executed!');
            res.json({ message: 'File uploaded and script executed!' }); // This line changed
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    };
};


