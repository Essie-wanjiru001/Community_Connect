import React from 'react';

interface SearchResult {
  id: string;
  name: string;
  serviceType: string;
  location: string;
  availability: string;
}

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800">Search Results</h2>

      {results.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {results.map((result) => (
            <li
              key={result.id}
              className="p-4 border rounded-md shadow-md bg-white transition hover:shadow-lg"
            >
              <p className="text-lg font-semibold text-gray-800">
                {result.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Service Type:</strong> {result.serviceType}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Location:</strong> {result.location}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Availability:</strong> {result.availability}
              </p>
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
