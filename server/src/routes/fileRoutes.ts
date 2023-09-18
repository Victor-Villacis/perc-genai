// fileRoutes.ts
import express from 'express';
import { Server } from 'socket.io';
import { getSummaryData, uploadWithIo, writeWithIo, getGPTAnswer } from '../controllers/fileController';
export default function (io: Server) {
    const router = express.Router();

    router.get('/getData', getSummaryData(io));
    router.post('/upload', uploadWithIo(io));
    router.get('/getGPTAnswer', getGPTAnswer(io))
    router.post('/write', writeWithIo(io));




    return router;
}