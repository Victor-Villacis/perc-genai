import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { createServer } from 'http';
import { Server as SocketIoServer } from 'socket.io';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { spawn } from 'child_process';

const app = express();
const port = process.env.PORT || 3000;

const httpServer = createServer(app);
const io = new SocketIoServer(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use(fileUpload());

interface ParsedData {
    [key: string]: {
        [key: string]: {
            [key: string]: string;
        };
    };
}

app.get('/getData', (req, res) => {
    fs.readFile(path.join(__dirname, 'ouput_folder/data.txt'), 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
        if (err) {
            console.error('Error reading the file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const lines = data.split('\n');
        let currentSection = '';
        let currentSubsection = '';
        const parsedData: ParsedData = {};

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

        res.json(parsedData);
    });
});

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.uploadedFile as UploadedFile;
    const savePath = path.join(__dirname, 'input_folder', uploadedFile.name);

    uploadedFile.mv(savePath, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }

        const pythonScriptPath = path.join(__dirname, './mock_processor.py');
        const python = spawn('python', [pythonScriptPath]);

        python.stdout.on('data', function (data) {
            console.log('Pipe data from python script ...');
        });

        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            if (code === 0) { // Ensure the Python script executed without errors
                io.emit('fileReady'); // Notify all connected clients that the file is ready
                res.send('File uploaded and script executed!');
            } else {
                res.status(500).send('Error executing script.');
            }
        });

    });
});

httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
