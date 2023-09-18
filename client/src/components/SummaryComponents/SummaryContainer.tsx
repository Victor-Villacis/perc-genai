import React, { useState, useEffect, useCallback, memo, FC } from 'react';
import axios from 'axios';
import NavBox from '../NavBox';
import Level1Summary from './Level1Summary';
import Level2Summary from './Level2Summary';
import { useSocket } from '../../sockets/socketManager';

let SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

if (!SERVER_URL) {
    console.log("VITE_REACT_APP_SERVER_URL is undefined, using fallback URL.");
    SERVER_URL = 'http://localhost:3000';
} else {
    console.log("Using VITE_REACT_APP_SERVER_URL from environment variables.");
}

console.log("Server URL: ", SERVER_URL);

const SummaryContainer: React.FC = memo(() => {
    const [summaryType, setSummaryType] = useState<'detailed' | 'overall'>('detailed');
    const [activeSectionLevel1, setActiveSectionLevel1] = useState(null);
    const [activeSectionLevel2, setActiveSectionLevel2] = useState(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [subSections, setSubSections] = useState<string[]>([]);
    const [data, setData] = useState(null);

    const fetchData = useCallback(async (type: 'detailed' | 'overall') => {
        setIsFetching(true);
        try {
            const res = await axios.get(`${SERVER_URL}/getData`, {
                params: { type },
            });
            const newData = res.data;
            setData(newData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsFetching(false);
        }
    }, []);

    useEffect(() => {
        fetchData(summaryType);
    }, [fetchData, summaryType]);

    useSocket(fetchData, undefined, summaryType);


    const toggleSummaryType = () => {
        const newType = summaryType === 'detailed' ? 'overall' : 'detailed';
        setSummaryType(newType);
        fetchData(newType);
    };

    const activeSection = summaryType === 'detailed' ? activeSectionLevel1 : activeSectionLevel2;
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
});

export default SummaryContainer;
