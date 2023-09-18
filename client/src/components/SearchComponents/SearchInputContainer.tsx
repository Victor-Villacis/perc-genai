import React, { useState, useEffect } from 'react';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import { handleSearchQuery, fetchSearchResults } from '../../api/api';
import { useSocket } from '../../sockets/socketManager';

const SearchInputContainer: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDataForPython = async (summaryType, scriptType) => {
        console.log("testing if this logs")
    };

    const fetchDataForR = async () => {
        try {
            const results = await fetchSearchResults();
            setSearchResults(results);
        } catch (error) {
            console.error('Error fetching R data:', error);
        }
    };

    useSocket(fetchDataForPython, fetchDataForR);

    const handleSearch = async () => {
        try {
            setIsLoading(true);
            const data = await handleSearchQuery(searchQuery);
            console.log(searchQuery, "Search Query")
            console.log("Type of data:", typeof data);
            console.log("Value of data:", data.message);
            // returning Value of data: Search query handled and R script executed! - response message
            setSearchResults(data);
        } catch (error) {
            console.error('Error handling search:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <SearchInput
                handleOpen={() => { }}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                isLoading={isLoading}
            />
            <SearchResults results={searchResults} />
        </div>
    );
};

export default SearchInputContainer;




