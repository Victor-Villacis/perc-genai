import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import styled from 'styled-components';

let SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

if (!SERVER_URL) {
    console.log("VITE_REACT_APP_SERVER_URL is undefined, using fallback URL.");
    SERVER_URL = 'http://localhost:3000';
} else {
    console.log("Using VITE_REACT_APP_SERVER_URL from environment variables.");
}

interface SearchResultsProps {
    results: string[];
}

// Styled Components
const ResultsContainer = styled.div`
  width: 80%;
  margin: auto;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
    const [answer, setAnswer] = useState<string | null>(null);

    const fetchAnswerData = useCallback(async () => {
        try {
            console.log(`Fetching GPT answer`);
            const response = await axios.get(`${SERVER_URL}/getGPTAnswer`);
            console.log(response, "from the sever");

            if (response.status !== 200) {
                throw new Error('Failed to fetch answer');
            }

            const newAnswer = response.data;
            console.log("Fetched Answer: ", newAnswer);
            setAnswer(newAnswer);

        } catch (error) {
            console.error('Error fetching answer:', error);
        }
    }, []);

    useEffect(() => {
        const socket = io(SERVER_URL);

        socket.on('connect', () => {
            console.log('Connected to WebSocket server.');
        });

        socket.on('connect_error', (error) => {
            console.error('Error connecting to WebSocket server:', error);
        });

        socket.on('fileReady', async (source) => {
            if (source === 'R') {
                try {
                    await fetchAnswerData();
                } catch (error) {
                    console.error('Error fetching answer:', error);
                }
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchAnswerData]);

    return (
        <ResultsContainer>
            <p>{answer ? answer : "No answer available"}</p>
        </ResultsContainer>
    );
};

export default SearchResults;
