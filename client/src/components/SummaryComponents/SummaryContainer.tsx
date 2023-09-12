import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import NavBox from '../NavBox';
import Level1Summary from './Level1Summary';
import Level2Summary from './Level2Summary';
import io from 'socket.io-client';

let SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

if (!SERVER_URL) {
    console.log("VITE_REACT_APP_SERVER_URL is undefined, using fallback URL.");
    SERVER_URL = 'http://localhost:3000';
} else {
    console.log("Using VITE_REACT_APP_SERVER_URL from environment variables.");
}

console.log("Server URL: ", SERVER_URL);

const SummaryContainer: React.FC = () => {
    const [summaryType, setSummaryType] = useState<'detailed' | 'overall'>('detailed');
    const [activeSectionLevel1, setActiveSectionLevel1] = useState(null);
    const [activeSectionLevel2, setActiveSectionLevel2] = useState(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [subSections, setSubSections] = useState<string[]>([]);
    const [data, setData] = useState(null);
    const activeSection = summaryType === 'detailed' ? activeSectionLevel1 : activeSectionLevel2;

    const fetchData = useCallback(async (type: 'detailed' | 'overall') => {
        setIsFetching(true);
        try {
            console.log(`Fetching data of type ${type}`);
            const response = await axios.get(`${SERVER_URL}/getData`, {
                params: {
                    type,
                },
            });

            if (response.status !== 200) {
                throw new Error('Failed to fetch data');
            }

            const newData = response.data;

            console.log("Fetched Data: ", newData);
            setData(newData);

            if (type === 'detailed' && activeSectionLevel1 === null) {
                const firstSection = newData && newData["Level1Summary"] ? Object.keys(newData["Level1Summary"])[0] : null;
                setActiveSectionLevel1(firstSection);
            } else if (type === 'overall' && activeSectionLevel2 === null) {
                const firstSection = newData && newData["Level2Summary"] ? Object.keys(newData["Level2Summary"])[0] : null;
                setActiveSectionLevel2(firstSection);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsFetching(false);
        }
    }, [activeSection]);

    useEffect(() => {
        const socket = io(SERVER_URL);

        socket.on('connect', () => {
            console.log('Connected to WebSocket server.');
        });

        socket.on('connect_error', (error) => {
            console.error('Error connecting to WebSocket server:', error);
        });

        socket.on('fileReady', async (source) => {
            if (source === 'Python') {
                try {
                    await fetchData(summaryType);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
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

    const sections = data ? Object.keys(data["Level1Summary"] || {}) : [];

    return (
        <div>
            <NavBox
                activeSection={activeSection}
                setActiveSection={summaryType === 'detailed' ? setActiveSectionLevel1 : setActiveSectionLevel2}
                sections={sections}
                toggleSummaryType={toggleSummaryType}
                isDataAvailable={!!data}
                summaryType={summaryType}
            />
            {summaryType === 'detailed' ? (
                <Level1Summary activeSection={activeSectionLevel1} data={data} />
            ) : (
                <Level2Summary activeSection={activeSectionLevel2} data={data} />
            )}
            {isFetching && <p>Loading...</p>}
        </div>
    );
};

export default SummaryContainer;