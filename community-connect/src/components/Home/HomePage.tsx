import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaComments } from 'react-icons/fa'; // Importing icons

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto text-center px-4 md:px-8">
          <h1 className="text-5xl font-bold mb-4">Welcome to Community Connect</h1>
          <p className="text-xl mb-8">
            Connecting local businesses, artisans, and service providers with your community.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20">
        <div className="container mx-auto text-center px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-10">Why Choose Community Connect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4 text-blue-600 text-3xl">
                <FaSearch /> {/* Icon */}
              </div>
              <h3 className="text-xl font-semibold mb-4">Discover Local Businesses</h3>
              <p className="text-gray-600">
                Find artisans, service providers, and businesses near you, all in one place.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4 text-blue-600 text-3xl">
                <FaCalendarAlt /> {/* Icon */}
              </div>
              <h3 className="text-xl font-semibold mb-4">Book Services Easily</h3>
              <p className="text-gray-600">
                Book services, set appointments, and manage bookings with just a few clicks.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4 text-blue-600 text-3xl">
                <FaComments /> {/* Icon */}
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-Time Chat</h3>
              <p className="text-gray-600">
                Communicate directly with service providers through real-time messaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto text-center px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-10">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-gray-700 italic mb-4">
                "Community Connect helped me find local artisans I wouldn't have discovered otherwise. It's my go-to platform for local services!"
              </p>
              <h4 className="font-bold text-gray-900">- Sarah P.</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-gray-700 italic mb-4">
                "The booking system is easy to use and the chat feature made coordinating with my service provider a breeze."
              </p>
              <h4 className="font-bold text-gray-900">- John D.</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-10">
        <div className="container mx-auto text-center px-4 md:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6">Join now and start connecting with your community.</p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center px-4 md:px-8">
          <p>&copy; 2024 Community Connect. All rights reserved.</p>
          <div className="mt-4">
            <Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link>
            <span className="mx-2">|</span>
            <Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
