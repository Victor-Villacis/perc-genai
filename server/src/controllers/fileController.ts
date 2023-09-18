import e, { Request, Response } from 'express';
import { uploadFile } from '../services/fileService';
import { getData } from '../services/fileService';
import { sendEmail } from '../services/email'; // Update this import path to point to your actual email file where sendEmail function resides.
import { handleSearchQuery } from '../services/fileService';
import { UploadedFile } from 'express-fileupload';
import { Server as SocketIoServer } from 'socket.io';
import { readGPTSearchFile } from '../services/fileService'; // Import from the correct location
import fs from 'fs';
import path from 'path';

type DataType = 'detailed' | 'overall';

export const getSummaryData = async (req: Request, res: Response): Promise<void> => {
    console.log('Get summary data endpoint hit');
    try {
        const type = req.query.type as string;

        if (type !== 'detailed' && type !== 'overall') {
            res.status(400).json({ message: 'Bad Request: Invalid type parameter' });
            return;
        }

        const data = await getData(type);
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const uploadWithIo = (io: SocketIoServer) => {
    console.log('Upload endpoint hit');
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const uploadedFile = req.files?.uploadedFile as UploadedFile;

            // Handle null or undefined email
            const userEmail = req.body?.email || "No email provided";

            if (!uploadedFile) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            await uploadFile(uploadedFile, io, userEmail);
            res.status(200).json({ message: 'File uploaded and script executed!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};

export const handleSearchEndpoint = async (req: Request, res: Response): Promise<void> => {
    try {
        const { searchQuery } = req.body;

        if (typeof searchQuery !== 'string' || searchQuery.trim().length === 0) {
            res.status(400).json({ message: 'Bad Request: Missing or invalid search query' });
            return;
        }

        await handleSearchQuery(searchQuery);
        res.status(200).json({ message: 'Search query handled and R script executed!' });
    } catch (err) {
        console.error('Error handling search:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const getSearchResults = async (req: Request, res: Response): Promise<void> => {
    try {
        const results: string[] = await readGPTSearchFile();
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
