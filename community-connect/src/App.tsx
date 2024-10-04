import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import ProfileForm from './components/Profile/ProfileForm';
import ProfileView from './components/Profile/ProfileView';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SearchPage from './components/Search/SearchPage';
import BookingForm from './components/Booking/BookingForm';
import BookingList from './components/Booking/BookingList';
import ChatPage from './components/Chat/ChatPage';
import RatingForm from './components/Ratings/RatingForm';
import ReviewList from './components/Ratings/ReviewList';  // Import Review Components

const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <Link to="/profile/view">View Profile</Link>
        <Link to="/profile/edit">Edit Profile</Link>
        <Link to="/search">Search Services</Link>
        <Link to="/booking/new">Book a Service</Link>
        <Link to="/booking/list">Your Bookings</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/reviews/add">Leave a Review</Link>
        <Link to="/reviews/view">View Reviews</Link> {/* Adds Review Links */}
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/view" element={<ProfileView />} />
        <Route path="/profile/edit" element={<ProfileForm />} />
        <Route path="/search" element={<SearchPage onSearch={(query) => console.log(query)} />} />
        <Route path="/booking/new" element={<BookingForm />} />
        <Route path="/booking/list" element={<BookingList />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/reviews/add" element={<RatingForm />} /> {/* Adds Route for Rating */}
        <Route path="/reviews/view" element={<ReviewList />} /> {/* Adds Route for Review List */}
        <Route path="/" element={<h1>Welcome to Community Connect</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
