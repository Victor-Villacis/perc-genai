import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';


import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { Button } from '@mui/material';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  width: 80%;
  margin: auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Logo = styled.img`
  width: 300px;
`;

const UploadButton = styled(Button)`
  background-color: #004387;
  color: #fff;
  border-radius: 50%;  // Make it round
  width: 50px;  // Fixed width
  height: 50px;  // Fixed height
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: #003366;
  }
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 12px;
  }
`;

interface SearchInputProps {
    handleOpen: () => void;
}



const SearchInput: React.FC<SearchInputProps> = ({ handleOpen }) => {
    const [query, setQuery] = useState<string>('');

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://localhost:3001/write', {
                query: query,
            });
            console.log('Server Response:', response.data);
            //TODO: Clear input. 
        } catch (error) {
            console.error('An error occurred while making the POST request:', error);
        }
    };



    return (
        <Container>
            <Header>
                <div>
                    <Logo src="src/assets/perc-logo.png" alt="word icon" />

                </div>
                <Tooltip title="Upload and Summarize with GPT AI">
                    <UploadButton type="button" onClick={handleOpen}>
                        <AddIcon />
                    </UploadButton>
                </Tooltip>
            </Header>

            <StyledTextField
                fullWidth
                placeholder="Ask a question..."
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Tooltip title="Click to search">
                                <QuestionAnswerIcon style={{ cursor: 'pointer' }} onClick={handleSearch} />
                            </Tooltip>
                        </InputAdornment>
                    ),
                    startAdornment: (
                        <InputAdornment position="start">
                            <Tooltip title="Ask any question about the recently uploaded document to get an answer.">
                                <HelpOutlineIcon />
                            </Tooltip>
                        </InputAdornment>
                    ),
                }}
            />
        </Container>
    );
};

export default SearchInput;
