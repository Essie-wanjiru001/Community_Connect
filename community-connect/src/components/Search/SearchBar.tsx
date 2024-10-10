import React, { useState } from 'react';

// Define the type for the search query
interface SearchQuery {
  serviceType: string;
  location: string;
  availability: string;
}

interface SearchBarProps {
  onSearch: (query: SearchQuery) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ serviceType, location, availability });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Service Type</label>
        <input
          type="text"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-gray-700">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-gray-700">Availability</label>
        <input
          type="text"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
