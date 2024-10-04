import React, { useState } from 'react';
import axios from 'axios';

const SearchBar: React.FC = () => {
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: any) => {
    try {
      const response = await axios.get('/api/search', { params: query });
      setResults(response.data);  // Set results based on response
      setError(null);  // Reset error if successful
    } catch (err) {
      setError('Error fetching search results');
      setResults([]);  // Reset results if there's an error
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch({ serviceType, location, availability });
  };

  return (
    <div>
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

      {error && <p>{error}</p>}

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
    </div>
  );
};

export default SearchBar;
