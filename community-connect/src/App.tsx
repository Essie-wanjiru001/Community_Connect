import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import {store} from './components/redux/store';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
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
import HomePage from './components/Home/HomePage';
import Navbar from './components/Layout/NavBar';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/view" element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <ProfileForm />
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <SearchPage onSearch={function (query: { serviceType: string; location: string; availability: string; }): void {
                  throw new Error('Function not implemented.');
                } } />
              </ProtectedRoute>
            } />
            <Route path="/booking/new" element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            } />
            <Route path="/booking/list" element={
              <ProtectedRoute>
                <BookingList />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
            <Route path="/reviews/add" element={
              <ProtectedRoute>
                <RatingForm />
              </ProtectedRoute>
            } />
            <Route path="/reviews/:serviceId" element={
              <ProtectedRoute>
                <ReviewList serviceId={''} />
              </ProtectedRoute>
            } />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;