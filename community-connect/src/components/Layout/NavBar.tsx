import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const NavLinks = ({ className = '' }) => (
    <>
      <Link to="/" className={`${className} hover:text-gray-300`} onClick={() => setIsOpen(false)}>Home</Link>
      <Link to="/profile/view" className={`${className} hover:text-gray-300`} onClick={() => setIsOpen(false)}>Profile</Link>
      <Link to="/search" className={`${className} hover:text-gray-300`} onClick={() => setIsOpen(false)}>Search</Link>
      <Link to="/booking/list" className={`${className} hover:text-gray-300`} onClick={() => setIsOpen(false)}>Bookings</Link>
      <Link to="/chat" className={`${className} hover:text-gray-300`} onClick={() => setIsOpen(false)}>Chat</Link>
      <Link to="/reviews/view" className={`${className} hover:text-gray-300`} onClick={() => setIsOpen(false)}>Reviews</Link>
    </>
  );

  return (
    <nav className="bg-blue-600 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">Community Connect</Link>

        {/* Hamburger Menu Button (for mobile) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Menu Links - Show on Medium+ Screens */}
        <div className="hidden md:flex space-x-6">
          <NavLinks />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-500">
          <div className="space-y-2 p-4">
            <NavLinks className="block text-white" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
