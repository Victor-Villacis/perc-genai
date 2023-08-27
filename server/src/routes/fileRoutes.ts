// fileRoutes.ts
import express from 'express';
import { Server } from 'socket.io';
import { getSummaryData, uploadWithIo } from '../controllers/fileController';

export default function (io: Server) {
    const router = express.Router();

    router.get('/getData', getSummaryData);
    router.post('/upload', uploadWithIo(io));
    return router;
}
