import React from 'react';

interface SearchResultsProps {
  results: any[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800">Search Results</h2>
      {results.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {results.map((result, index) => (
            <li key={index} className="p-4 border rounded-md shadow-sm bg-gray-50">
              <p><strong>Name:</strong> {result.name}</p>
              <p><strong>Service Type:</strong> {result.serviceType}</p>
              <p><strong>Location:</strong> {result.location}</p>
              <p><strong>Availability:</strong> {result.availability}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 mt-4">No results found</p>
      )}
    </div>
  );
};

export default SearchResults;
