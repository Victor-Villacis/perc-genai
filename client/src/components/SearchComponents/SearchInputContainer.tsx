import React, { useState, useEffect } from 'react';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import FileDropzone from './FileDropzone';

const SearchInputContainer: React.FC = () => {
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [open, setOpen] = React.useState(true);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div>
            <FileDropzone open={open} handleOpen={handleOpen} handleClose={handleClose} />
            <SearchInput handleOpen={handleOpen} />
            <SearchResults results={searchResults} />
        </div>
    );
};

export default SearchInputContainer;

