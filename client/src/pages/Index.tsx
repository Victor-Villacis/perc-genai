import React from 'react';
import { Box } from '@mui/material';
import FileDropzone from '../components/SearchComponents/FileDropzone';
import SearchInputContainer from '../components/SearchComponents/SearchInputContainer';
import ContentBoxContainer from '../components/SummaryComponents/SummaryContainer';

export default function Index() {



    return (
        <Box>
            <br />
            <br />
            <br />
            <SearchInputContainer />
            <br />
            <br />
            <br />
            <ContentBoxContainer />

        </Box>
    );
}