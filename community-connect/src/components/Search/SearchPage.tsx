import React, { useState } from 'react';
import MapSearch from './MapSearch'; // Import the MapSearch component

interface SearchPageProps {
  onSearch: (query: { serviceType: string; location: string; availability: string }) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onSearch }) => {
  const [query, setQuery] = useState({ serviceType: '', location: '', availability: '' });

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Search filters */}
      <div className="w-full md:w-1/3 p-4">
        <input
          type="text"
          placeholder="Service Type"
          value={query.serviceType}
          onChange={(e) => setQuery({ ...query, serviceType: e.target.value })}
          className="border p-2 mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Location"
          value={query.location}
          onChange={(e) => setQuery({ ...query, location: e.target.value })}
          className="border p-2 mb-4 w-full"
        />
        <input
          type="date"
          value={query.availability}
          onChange={(e) => setQuery({ ...query, availability: e.target.value })}
          className="border p-2 mb-4 w-full"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {/* Map */}
      <div className="w-full md:w-2/3">
        <MapSearch searchResults={[]} />
      </div>
    </div>
  );
};

export default SearchPage;
