import React, { useState } from 'react';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface ContentBoxProps {
    activeSection: string | null;
    data: any;  // Specify a more detailed type if possible
}

const ContentBox: React.FC<ContentBoxProps> = ({ activeSection, data }) => {

    const [activeQuote, setActiveQuote] = useState({});

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

            {data && Object.keys(data).map((mainSection, index) => {
                if (activeSection && mainSection !== activeSection) return null;
                return (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <h2>{mainSection}</h2>
                        {Object.keys(data[mainSection]).map((subsection) => (
                            <div key={subsection}>
                                <h3>{subsection}</h3>
                                <p>Summary: {data[mainSection][subsection].Summary}</p>
                                <div style={{ backgroundColor: "#8a95a5", padding: "5px", color: "#000" }}>
                                    {activeQuote[`${mainSection}-${subsection}`] ? (
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
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default ContentBox;
