import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './components/redux/store';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import SearchPage from './components/Search/SearchPage';
import HomePage from './components/Home/HomePage';
import ChatPage from './components/Chat/ChatPage';
import ProfileView from './components/Profile/ProfileView';
import ProfileForm from './components/Profile/ProfileForm';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import BookingForm from './components/Booking/BookingForm';
import BookingList from './components/Booking/BookingList';
import RatingForm from './components/Ratings/RatingForm';
import ReviewList from './components/Ratings/ReviewList';
import Navbar from './components/Layout/NavBar';

interface SearchQuery {
  serviceType: string;
  location: string;
  availability: string;
}

// Component for rendering the ChatPage with dynamic user data
const ChatPageWithProps: React.FC = () => {
  const location = useLocation();
  const { otherUserId, otherUserName } = location.state || { otherUserId: '', otherUserName: '' };
  return <ChatPage otherUserId={otherUserId} otherUserName={otherUserName} />;
};

// 404 Page Component with Navigation to Chat or Home
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-red-600">404 - Page Not Found</h1>
      <p className="text-lg mb-6 text-gray-600">Oops! The page you're looking for doesn't exist.</p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Home
        </button>
        <button
          onClick={() => navigate('/chat/1', { state: { otherUserId: '1', otherUserName: 'Support' } })}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Start Chat with Support
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const handleSearch = (query: SearchQuery) => {
    console.log('Search query:', query);
  };

  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/profile/view"
              element={
                <ProtectedRoute>
                  <ProfileView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <ProfileForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchPage onSearch={handleSearch} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/new/:id"
              element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/list"
              element={
                <ProtectedRoute>
                  <BookingList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:otherUserId"
              element={
                <ProtectedRoute>
                  <ChatPageWithProps />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews/add"
              element={
                <ProtectedRoute>
                  <RatingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews/:serviceId"
              element={
                <ProtectedRoute>
                  <ReviewList serviceId="" />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
