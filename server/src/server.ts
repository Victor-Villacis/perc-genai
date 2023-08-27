import express from 'express';
import cors, { CorsOptions } from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fileUpload from 'express-fileupload';
import { setupSockets } from './sockets/sockets';
import fileRoutes from './routes/fileRoutes';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const httpServer = createServer(app);


const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const CLIENT_HOST = process.env.CLIENT_HOST || 'localhost';
const CLIENT_PORT = process.env.CLIENT_PORT || 5173;

export const io = new Server(httpServer, {
    cors: {
        origin: `http://${CLIENT_HOST}:${CLIENT_PORT}`,
        methods: ['GET', 'POST']
    }
});


const corsOptions = (req: express.Request, callback: (err: Error | null, options?: CorsOptions) => void) => {
    let corsOptions;
    const allowedOrigins = [`http://${CLIENT_HOST}:${CLIENT_PORT}`, `http://${SERVER_HOST}:${SERVER_PORT}`];

    // Check if Origin header is not undefined
    const origin = req.header('Origin');
    if (origin && allowedOrigins.includes(origin)) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }

    callback(null, corsOptions);
};

app.use(cors(corsOptions));
app.use(express.json());
setupSockets(io);

app.use(fileUpload());
app.use((req, res, next) => {
    console.log('File upload middleware hit');
    console.log('Files:', req.files);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);
    console.log('Params:', req.params);
    console.log('Query:', req.query);
    next();
});
app.use(fileRoutes(io));

httpServer.listen(SERVER_PORT, () => {
    console.log(`Server is running at http://${SERVER_HOST}:${SERVER_PORT}`);

});