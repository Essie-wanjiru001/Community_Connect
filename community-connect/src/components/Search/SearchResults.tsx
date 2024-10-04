import React from 'react';

interface SearchResultsProps {
  results: Array<any>;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div>
      <h2>Search Results</h2>
      {results.length > 0 ? (
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              <p><strong>Name:</strong> {result.name}</p>
              <p><strong>Service Type:</strong> {result.serviceType}</p>
              <p><strong>Location:</strong> {result.location}</p>
              <p><strong>Availability:</strong> {result.availability}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResults;
