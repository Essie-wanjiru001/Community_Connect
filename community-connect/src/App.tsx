import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfileView from './components/Profile/ProfileView';
import ProfileForm from './components/Profile/ProfileForm';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SearchPage from './components/Search/SearchPage';
import BookingForm from './components/Booking/BookingForm';
import BookingList from './components/Booking/BookingList';
import ChatPage from './components/Chat/ChatPage';
import RatingForm from './components/Ratings/RatingForm';
import ReviewList from './components/Ratings/ReviewList';
import HomePage from './components/Home/HomePage';  // Import the HomePage
import Navbar from './components/Layout/NavBar'; // Import Navbar component

const App: React.FC = () => {
  const handleSearch = (query: { serviceType: string; location: string; availability: string }) => {
    // Implement actual search handling logic here
    console.log('Search query:', query);
  };

  return (
    <Router>
      <Navbar /> {/* Move Navbar here to show on every page */}

      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/view" element={<ProfileView />} />
          <Route path="/profile/edit" element={<ProfileForm />} />
          <Route path="/search" element={<SearchPage onSearch={handleSearch} />} />
          <Route path="/booking/new" element={<BookingForm />} />
          <Route path="/booking/list" element={<BookingList />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/reviews/add" element={<RatingForm />} />
          <Route path="/reviews/view" element={<ReviewList serviceId="someServiceId" />} />
          <Route path="/" element={<HomePage />} />  {/* HomePage route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
