// fileRoutes.ts
import express from 'express';
import { Server } from 'socket.io';
import { getSummaryData, uploadWithIo, handleSearchEndpoint, getSearchResults } from '../controllers/fileController';

export default function (io: Server) {
    const router = express.Router();

    router.get('/getData', getSummaryData);
    router.post('/upload', uploadWithIo(io));
    router.post('/handleSearch', handleSearchEndpoint);
    router.get('/searchResults', getSearchResults);

    return router;
}
