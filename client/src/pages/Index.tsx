import { Box } from '@mui/material';
// import dropzone
import FileDropzone from '../components/FileDropzone';
import SearchInputContainer from '../components/SearchComponents/SearchInputContainer';
import React from 'react';
import ContentBoxContainer from '../components/SummaryComponents/SummaryContainer';
export default function Index() {

    const [open, setOpen] = React.useState(true);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        // This is the main page that will be rendered at '/'
        // It is the parent of all other pages
        <Box>
            <FileDropzone open={open} handleOpen={handleOpen} handleClose={handleClose} />
            <br />
            <br />
            <br />
            <SearchInputContainer handleOpen={handleOpen} />
            <br />
            <br />
            <br />
            <ContentBoxContainer />

        </Box>
    );
}