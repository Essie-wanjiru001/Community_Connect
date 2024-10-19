import React, { useState, useEffect, useCallback } from 'react';
import MapSearch from './MapSearch';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

interface SearchResult {
  id: string;
  name: string;
  serviceType: string;
  location: string;
  availability: string;
  coordinates: { lat: number; lng: number };
}

interface SearchPageProps {
  onSearch: (query: { serviceType: string; location: string; availability: string }) => void;
}

// Dynamically generate mock data for all categories
const generateMockResults = (): SearchResult[] => {
  const categories = [
    'Plumber', 'Electrician', 'TV Mounting', 'Furniture Assembly', 'Home Appliances',
    'Help Moving', 'House Cleaning', 'Yard Work', 'Furniture Removal', 'Lawn Care',
    'Hang Pictures', 'Shelf Mounting', 'Plumbing'
  ];

  return categories.map((category, index) => ({
    id: `${index + 1}`,
    name: `${category} Pro`,
    serviceType: category,
    location: 'Kigali',
    availability: `2024-10-${19 + index}`,
    coordinates: { lat: -1.95 + index * 0.01, lng: 30.05 + index * 0.01 }
  }));
};

const mockResults = generateMockResults(); // Generate mock results dynamically

const SearchPage: React.FC<SearchPageProps> = ({ onSearch }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState(() => {
    const savedQuery = localStorage.getItem('searchQuery');
    return savedQuery
      ? JSON.parse(savedQuery)
      : { serviceType: '', location: '', availability: '' };
  });

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(
    debounce(() => {
      localStorage.setItem('searchQuery', JSON.stringify(query));
      setLoading(true);

      setTimeout(() => {
        const filteredResults = mockResults.filter(
          (result) =>
            result.serviceType.toLowerCase().includes(query.serviceType.toLowerCase()) &&
            result.location.toLowerCase().includes(query.location.toLowerCase()) &&
            result.availability === query.availability
        );

        setSearchResults(filteredResults);
        setLoading(false);
        onSearch(query);
      }, 1000); // Simulate network delay
    }, 500),
    [query, onSearch]
  );

  useEffect(() => {
    handleSearch(); // Execute search on initial load
  }, [handleSearch]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Search Filters */}
      <div className="w-full md:w-1/3 p-4 bg-white shadow-md">
        <h2 className="text-2xl font-bold mb-4">Search Services</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {mockResults.map((category) => (
            <button
              key={category.serviceType}
              onClick={() => setQuery({ ...query, serviceType: category.serviceType })}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              {category.serviceType}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Location"
          value={query.location}
          onChange={(e) => setQuery({ ...query, location: e.target.value })}
          className="border p-2 mb-4 w-full rounded"
        />
        <input
          type="date"
          value={query.availability}
          onChange={(e) => setQuery({ ...query, availability: e.target.value })}
          className="border p-2 mb-4 w-full rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Map and Search Results */}
      <div className="w-full md:w-2/3 p-4">
        <MapSearch searchResults={searchResults} />

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {searchResults.map((result) => (
              <li key={result.id} className="p-4 bg-gray-100 rounded shadow">
                <h3 className="text-lg font-bold">{result.name}</h3>
                <p>{result.serviceType} in {result.location}</p>
                <p>Available on: {result.availability}</p>
                <button
                  onClick={() =>
                    navigate(`/chat/${result.id}`, { state: { otherUserId: result.id, otherUserName: result.name } })
                  }
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Start Chat
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-xl">No results found. Try again!</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
