import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { handleSearchQuery } from '../../api/api';

import Typography from '@mui/material/Typography';
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
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    handleSearch: () => Promise<void>;
    isLoading: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ handleOpen, setSearchQuery, handleSearch, isLoading }) => {
    const [localSearchQuery, setLocalSearchQuery] = useState(''); // renamed to localSearchQuery to avoid conflict
    // Debugging line

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            // e.preventDefault();
            // setSearchQuery(localSearchQuery); // update the parent's state
            await handleSearch(); // use the parent's handleSearch
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);  // update local state
        setSearchQuery(e.target.value);  // update parent's state
    };


    return (
        <Container>
            <Header>
                <div>
                    <Logo src="src/assets/perc-logo.png" alt="word icon" />
                    {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "#004387" }}>
                        Search Within Document
                    </Typography> */}
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
                value={localSearchQuery}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Tooltip title="Click to search">
                                <QuestionAnswerIcon onClick={handleSearch} style={{ cursor: 'pointer' }} />
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
