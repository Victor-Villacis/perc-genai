import React, { useState, useEffect, useCallback } from 'react';
import ContentBox from './ContentBox';
import NavBox from './NavBox';
import io from 'socket.io-client';

let SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

if (!SERVER_URL) {
    console.log("VITE_REACT_APP_SERVER_URL is undefined, using fallback URL.");
    SERVER_URL = 'http://localhost:3000';
} else {
    console.log("Using VITE_REACT_APP_SERVER_URL from environment variables.");
}

console.log("Server URL: ", SERVER_URL);

const ContentBoxContainer: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [data, setData] = useState<Record<string, any> | null>(null);
    const [summaryType, setSummaryType] = useState<'detailed' | 'overall'>('detailed');
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const fetchData = useCallback(async (type: 'detailed' | 'overall') => {
        setIsFetching(true);
        try {
            console.log(`Fetching data of type ${type}`);
            const res = await fetch(`${SERVER_URL}/getData?type=${type}`);
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }
            const newData = await res.json();
            console.log("Fetched Data: ", newData);
            setData(newData);

            const firstSection = Object.keys(newData)[0];
            if (firstSection) {
                setActiveSection(firstSection);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsFetching(false);
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

        socket.on('fileReady', () => {
            console.log('File ready for download.');
            fetchData(summaryType);
        });

        return () => {
            socket.disconnect();
        };
    }, [summaryType, fetchData]);

    const toggleSummaryType = () => {
        const newType = summaryType === 'detailed' ? 'overall' : 'detailed';
        setSummaryType(newType);
        fetchData(newType);
    };

    const sections = data ? Object.keys(data) : [];
    console.log("Sections: ", sections);

    return (
        <div>
            <NavBox
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                sections={sections}
                toggleSummaryType={toggleSummaryType}
                isDataAvailable={!!data}
            />
            <ContentBox activeSection={activeSection} data={data} />
            {isFetching && <p>Loading...</p>}
        </div>
    );
};

export default ContentBoxContainer;
