import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';

interface NavBoxProps {
    activeSection: string | null;
    setActiveSection: React.Dispatch<React.SetStateAction<string | null>>;
    sections: string[];
    toggleSummaryType: () => void;
    isDataAvailable: boolean;  // New prop
}


const NavBox: React.FC<NavBoxProps> = ({ activeSection, setActiveSection, sections, toggleSummaryType, isDataAvailable }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', margin: 'auto', marginBottom: "10px", border: "1px solid #aaa" }}>
            <div style={{
                padding: '20px',
            }}>
                <section style={{ display: 'flex', alignItems: 'center', flexWrap: "wrap" }}>
                    {sections.map((section) => (
                        <span
                            key={section}
                            onClick={() => setActiveSection(section)}
                            style={{ cursor: 'pointer', margin: '10px', color: activeSection === section ? 'blue' : 'black', borderBottom: activeSection === section ? '2px solid blue' : 'none', paddingBottom: '5px', fontWeight: activeSection === section ? 'bold' : 'normal', textDecoration: 'none', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1.5' }}
                        >
                            {section}
                        </span>
                    ))}
                    <hr style={{ backgroundColor: 'lightgray', height: '2px', width: '100%', margin: 'auto', marginTop: "10px" }} />
                </section>

            </div>
            <Button
                variant="contained"
                color="primary"
                style={{ alignSelf: 'center', marginRight: "2%" }}
                onClick={toggleSummaryType}
                disabled={!isDataAvailable}  // Disable the button if data is not available
            >
                Overall Summary
            </Button>

        </div>
    );
};

export default NavBox;
