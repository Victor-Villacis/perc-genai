import React from 'react';
import styled from 'styled-components';

// Styled Components
const ResultsContainer = styled.div`
  width: 80%;
  margin: auto;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

interface SearchResultsProps {
    results: string[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {



    if (typeof results === 'string') {
        // Handling plain text string
        return (
            <ResultsContainer>
                <p>{results}</p>
            </ResultsContainer>
        );
    } else if (Array.isArray(results)) {
        // Handling array of strings
        return (
            <ResultsContainer>
                {results.length === 0 ? (
                    <p>No results found.</p>
                ) : (
                    <ul>
                        {results.map((result, index) => (
                            <li key={index}>{result}</li>
                        ))}
                    </ul>
                )}
            </ResultsContainer>
        );
    } else {
        // Handling unexpected data format
        return (
            <ResultsContainer>
                <p>Unexpected data format.</p>
            </ResultsContainer>
        );
    }
};

export default SearchResults;