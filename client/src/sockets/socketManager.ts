import { useEffect } from 'react';
import io from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL || 'http://localhost:3000';



export const useSocket = (fetchData, fetchSearchResults?, summaryType: 'detailed' | 'overall') => {
    useEffect(() => {
        const handleFileReady = async (scriptType: string) => {
            try {
                console.log(`File ready for download. Script Type: ${scriptType}`);

                if (scriptType === "Python") {
                    if (typeof fetchData === "function") {
                        await fetchData(summaryType);  // Use the summaryType variable here
                    } else {
                        console.error("fetchData is not a function");
                    }
                } else if (scriptType === "R") {
                    if (typeof fetchSearchResults === "function") {
                        await fetchSearchResults(scriptType);
                    } else {
                        console.error("fetchSearchResults is not defined yet");
                    }
                }
            } catch (error) {
                console.error(`Error handling fileReady event for ${scriptType}:`, error);
                if (error instanceof Error) {
                    console.error(`Error message: ${error.message}`);
                    console.error(`Error stack: ${error.stack}`);
                }
            }
        };

        const socket = io(SERVER_URL, {
            reconnectionAttempts: 3,
            timeout: 5000,
        });

        socket.on('connect', () => {
            console.log('Connected to WebSocket server.');
        });

        socket.on('connect_error', (error) => {
            console.error('Error connecting to WebSocket server:', error);
            if (error instanceof Error) {
                console.error(`Error message: ${error.message}`);
                console.error(`Error stack: ${error.stack}`);
            }
        });

        socket.on('fileReady', handleFileReady);

        return () => {
            console.log('Disconnecting from WebSocket server.');
            socket.disconnect();
        };

    }, [fetchData, fetchSearchResults, summaryType]);  // Add summaryType to the dependency array
};
