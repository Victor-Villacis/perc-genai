import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';

interface SearchInputProps {
    handleOpen: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ handleOpen }) => {
    return (
        <div style={{ width: '80%', margin: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                    <img src="src/assets/perc-logo.png" alt="word icon" style={{ width: '300px', }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "#004387" }}>
                        <span style={{ color: '#004387' }}>Search Within Document</span>
                    </Typography>
                </div>
                <Button type="button" onClick={handleOpen}>
                    Upload File and Run Summary
                </Button>
            </div>


            <TextField
                fullWidth
                placeholder="Search text"
                variant="outlined"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    style: { borderRadius: '12px' }
                }}
            />
        </div>
    );
};

export default SearchInput;
