import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: any) => void; // Function that takes a query object and returns void
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Service Type</label>
        <input
          type="text"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          placeholder="Enter service type"
        />
      </div>

      <div>
        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
      </div>

      <div>
        <label>Availability</label>
        <input
          type="text"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          placeholder="Enter availability"
        />
      </div>

      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
