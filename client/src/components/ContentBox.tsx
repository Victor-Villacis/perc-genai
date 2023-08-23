import React, { useEffect, useState } from 'react';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import NavBox from './Navbox';
import io from 'socket.io-client';

const ContentBox = () => {
    const [data, setData] = useState(null);
    const [activeQuote, setActiveQuote] = useState({});

    // useEffect(() => {
    //     fetch('http://localhost:3000/getData')
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setData(data);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //         });
    // }, []);

    useEffect(() => {
        const socket = io('http://localhost:3000');


        socket.on('connect', () => {
            console.log('Connected to the WebSocket server.');
        });

        socket.on('connect_error', (error) => {
            console.error('Error connecting to the WebSocket server:', error);
        });

        socket.on('fileReady', () => {
            // When the "fileReady" event is received, fetch the data
            fetch('http://localhost:3000/getData')
                .then((res) => res.json())
                .then((data) => {
                    setData(data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        });

        // Cleanup the socket connection when the component is unmounted
        return () => {
            socket.disconnect();
        };
    }, []);
    const toggleQuote = (mainSection, subsection) => {
        const key = `${mainSection}-${subsection}`;
        setActiveQuote((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    return (
        <div style={{
            backgroundColor: 'lightgray',
            marginTop: '20px',
            width: '80%',
            margin: 'auto',
            marginBottom: '20px',
            padding: '20px',
            border: '2px solid lightgray',
        }}>
            <NavBox sections={data ? Object.keys(data) : []} />


            {data && Object.keys(data).map((mainSection, index) => (

                <div key={index} style={{ marginBottom: '20px' }}>
                    <h2>{mainSection}</h2>
                    {Object.keys(data[mainSection]).map((subsection) => (
                        <div key={subsection}>
                            <h3>{subsection}</h3>
                            <p>Summary: {data[mainSection][subsection].Summary}</p>
                            <p style={{ backgroundColor: "#8a95a5", padding: "5px", color: "#000" }}>  {activeQuote[`${mainSection}-${subsection}`] ? (
                                <div>
                                    {Object.keys(data[mainSection][subsection])
                                        .filter(key => key.startsWith("Quote"))
                                        .map((quoteKey, idx) => (
                                            <p key={idx}>{quoteKey}: {data[mainSection][subsection][quoteKey]}</p>
                                        ))
                                    }
                                    <div
                                        onClick={() => toggleQuote(mainSection, subsection)}
                                        style={{ backgroundColor: '#aaa', padding: '10px', cursor: "pointer", display: "flex", color: "black" }}>
                                        <ExpandLessIcon style={{ marginRight: "10px" }} /> Hide Quotes  <ExpandLessIcon style={{ marginLeft: "10px" }} />
                                    </div>

                                </div>
                            ) : (
                                <div
                                    onClick={() => toggleQuote(mainSection, subsection)}
                                    style={{ backgroundColor: '#ccc', padding: '10px', cursor: "pointer", display: 'flex', alignItems: 'center', color: "black" }}>
                                    <FormatQuoteIcon style={{ marginRight: '5px' }} />
                                    Quotes
                                </div>

                            )} </p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ContentBox;
