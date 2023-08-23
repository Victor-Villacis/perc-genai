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
                    <Typography variant="h6" style={{ fontSize: '20px', marginRight: '5px', color: "green" }}>
                        GPT
                    </Typography>
                    <Typography variant="body2" style={{ fontSize: '10px' }}>
                        Powered For Your Concern
                    </Typography>
                </div>
                <Button type="button" onClick={handleOpen}>
                    <button >Upload File and Run Summary</button>
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
