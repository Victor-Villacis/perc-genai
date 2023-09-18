import axios, { AxiosResponse } from 'axios';

export const handleSearchQuery = async (searchQuery: string): Promise<any> => {
    try {
        const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL || 'http://localhost:3000';
        const response: AxiosResponse = await axios.post(`${serverUrl}/handleSearch`, { searchQuery })
            .catch(error => {
                console.error("Error during handleSearchQuery: ", error);
                console.error("Error Request: ", error.request);
                console.error("Error Response: ", error.response);
                throw error; // Re-throw the error to be caught by the try...catch block
            });

        console.log(response.data, "hello");
        return response.data;

    } catch (error) {
        console.error('Error handling search:', error);
        throw error;
    }
};

export const fetchSearchResults = async (): Promise<string[]> => {
    try {
        const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL || 'http://localhost:3000';
        const response: AxiosResponse<string[]> = await axios.get(`${serverUrl}/searchResults`)
            .catch(error => {
                console.error("Error during fetchSearchResults: ", error);
                console.error("Error Request: ", error.request);
                console.error("Error Response: ", error.response);
                throw error; // Re-throw the error to be caught by the try...catch block
            });

        return response.data;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};
