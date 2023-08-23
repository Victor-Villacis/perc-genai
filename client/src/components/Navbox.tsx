import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';

const NavBox = ({ sections }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', margin: 'auto', marginBottom: "10px", border: "1px solid #aaa" }}>
            <div style={{
                border: '2px solid lightgray',
                padding: '20px',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
            }}>
                {sections.map(section => (
                    <NavLink
                        key={section}
                        to={`/${section.replace(/\s+/g, '-').toLowerCase()}`}
                        activeStyle={{ textDecoration: 'underline', textDecorationColor: 'blue' }}
                        style={{ margin: '10px', textDecoration: 'none' }}
                    >
                        {section}
                    </NavLink>

                ))}
                <hr style={{ backgroundColor: 'lightgray', height: '2px', width: '100%', margin: 'auto', marginTop: "10px" }} />
            </div>
            {/* I need to click this button and switch the summary to level 2 */}
            <Button variant="contained" color="primary" style={{ alignSelf: 'center', marginRight: "2%" }}>
                Overall Summary
            </Button>
        </div>
    );
};

export default NavBox;
