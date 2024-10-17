import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCouch, FaBroom, FaTools, FaDollarSign, FaExchangeAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section with Background Image and Overlay */}
      <section
        className="relative bg-cover bg-center h-screen text-white flex items-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/23614249/pexels-photo-23614249/free-photo-of-market-stalls-with-watermelons.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Discover Local Services & Professionals
          </h1>
          <p className="text-xl mb-8 font-semibold">
            Connecting local businesses, artisans, and service providers with your community.
          </p>

          {/* Search Bar */}
          <div className="relative mx-auto max-w-xl mt-8">
            <input
              type="text"
              placeholder="What service are you looking for?"
              className="w-full p-4 pr-15 rounded-full text-gray-700 focus:outline-none border-2 border-gray-300 shadow-lg text-lg font-semibold"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300 flex items-center justify-center shadow-lg mb-10">
              <FaSearch size={18} />
            </button>
          </div>

          {/* Call to Action Buttons or Welcome Message */}
          {!isAuthenticated ? (
            <div className="mt-8 flex justify-center space-x-6">
              <Link
                to="/register"
                className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition"
              >
                Join Now
              </Link>
              <Link
                to="/login" 
                className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <p className="text-2xl font-semibold">Welcome back, {user?.name || 'User'}!</p>
              <p className="text-xl mt-2">Explore services or check your dashboard for updates.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section with Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4 md:px-8">
          <h2 className="text-4xl font-bold mb-10">Explore Our Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <FaCouch className="text-blue-500 text-5xl mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Assembly</h3>
              <p className="text-gray-600 mb-4">Help with assembling furniture or equipment.</p>
              <Link to="/services/assembly" className="text-blue-500 hover:underline">Learn More</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <FaBroom className="text-blue-500 text-5xl mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Cleaning</h3>
              <p className="text-gray-600 mb-4">Professional home and office cleaning services.</p>
              <Link to="/services/cleaning" className="text-blue-500 hover:underline">Learn More</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <FaTools className="text-blue-500 text-5xl mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Mechanics</h3>
              <p className="text-gray-600 mb-4">General repairs and fixes around the house.</p>
              <Link to="/services/handyman" className="text-blue-500 hover:underline">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with Payment and Money Icons */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto text-center px-4 md:px-8">
          <h2 className="text-4xl font-bold mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <FaDollarSign className="text-blue-500 text-5xl mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Easy Payments</h3>
              <p className="text-gray-600">Secure and flexible payment options.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <FaExchangeAlt className="text-blue-500 text-5xl mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Trusted Transactions</h3>
              <p className="text-gray-600">Fast and reliable transaction processing.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <FaTools className="text-blue-500 text-5xl mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Quality Services</h3>
              <p className="text-gray-600">High-quality local services you can trust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Section - Find More Services */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center px-4 md:px-8">
          <h2 className="text-4xl font-bold mb-10">Need Help Today</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition">
              General Mounting
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition">
              TV Mounting
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition">
              Furniture Assembly
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition">
              Home Appliances
              Home Appliances
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition">
              Help Moving
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition">
              House Cleaning
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition">
              Yard Work
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition">
              Furniture Removal
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition">
              Lawn Care
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition">
              Hang Pictures
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition">
              Shelf Mounting
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition">
              Plumbing
            </button>
          </div>
          <div className="mt-8">
            <Link to="/services" className="text-blue-500 font-semibold hover:underline">
              See All Services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Services Section with Images */}
      <section className="py-16">
        <div className="container mx-auto text-center px-4 md:px-8">
          <h2 className="text-4xl font-bold mb-10">Popular Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group">
              <img src="https://images.pexels.com/photos/17912719/pexels-photo-17912719/free-photo-of-people-moving-to-a-house.jpeg" alt="Service" className="rounded-lg shadow-lg" />
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-75 transition duration-300 rounded-lg"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-semibold">Furniture Assembly</h3>
                <p className="mt-2">Starting at $50</p>
                <Link to="/services/assembly" className="mt-4 bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600 transition">
                  Book Now
                </Link>
              </div>
            </div>
            <div className="relative group">
              <img src="https://images.pexels.com/photos/17912719/pexels-photo-17912719/free-photo-of-people-moving-to-a-house.jpeg" alt="Service" className="rounded-lg shadow-lg" />
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-75 transition duration-300 rounded-lg"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-semibold">Mount a TV</h3>
                <p className="mt-2">Starting at $60</p>
                <Link to="/services/tv-mounting" className="mt-4 bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600 transition">
                  Book Now
                </Link>
              </div>
            </div>
            <div className="relative group">
              <img src="https://images.pexels.com/photos/17912719/pexels-photo-17912719/free-photo-of-people-moving-to-a-house.jpeg" alt="Service" className="rounded-lg shadow-lg" />
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-75 transition duration-300 rounded-lg"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-semibold">Help Moving</h3>
                <p className="mt-2">Starting at $80</p>
                <Link to="/services/moving" className="mt-4 bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600 transition">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support and Payment Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center md:text-left px-4 md:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Get Support</h3>
            <ul>
              <li><Link to="/help" className="text-gray-600 hover:underline">Help Center</Link></li>
              <li><Link to="/live-chat" className="text-gray-600 hover:underline">Live Chat</Link></li>
              <li><Link to="/order-status" className="text-gray-600 hover:underline">Check Order Status</Link></li>
              <li><Link to="/refunds" className="text-gray-600 hover:underline">Refunds</Link></li>
              <li><Link to="/report-abuse" className="text-gray-600 hover:underline">Report Abuse</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Payments and Protections</h3>
            <ul>
              <li><Link to="/payments" className="text-gray-600 hover:underline">Safe and Easy Payments</Link></li>
              <li><Link to="/money-back" className="text-gray-600 hover:underline">Money-back Policy</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:underline">On-time Shipping</Link></li>
              <li><Link to="/after-sales" className="text-gray-600 hover:underline">After-sales Protection</Link></li>
              <li><Link to="/product-monitoring" className="text-gray-600 hover:underline">Product Monitoring</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Source on Community Connect</h3>
            <ul>
              <li><Link to="/rfq" className="text-gray-600 hover:underline">Request for Quotation</Link></li>
              <li><Link to="/membership" className="text-gray-600 hover:underline">Membership Program</Link></li>
              <li><Link to="/logistics" className="text-gray-600 hover:underline">Logistics</Link></li>
              <li><Link to="/tax-vat" className="text-gray-600 hover:underline">Sales Tax and VAT</Link></li>
              <li><Link to="/reads" className="text-gray-600 hover:underline">Community Connect Reads</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Sell on Community Connect</h3>
            <ul>
              <li><Link to="/start-selling" className="text-gray-600 hover:underline">Start Selling</Link></li>
              <li><Link to="/seller-central" className="text-gray-600 hover:underline">Seller Central</Link></li>
              <li><Link to="/verified-supplier" className="text-gray-600 hover:underline">Become a Verified Supplier</Link></li>
              <li><Link to="/partnerships" className="text-gray-600 hover:underline">Partnerships</Link></li>
              <li><Link to="/supplier-app" className="text-gray-600 hover:underline">Download the App for Suppliers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Get to Know Us</h3>
            <ul>
              <li><Link to="/about" className="text-gray-600 hover:underline">About Community Connect</Link></li>
              <li><Link to="/corporate-responsibility" className="text-gray-600 hover:underline">Corporate Responsibility</Link></li>
              <li><Link to="/news" className="text-gray-600 hover:underline">News Center</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:underline">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-8 flex justify-center md:justify-start">
          <img src="https://cdn-icons-png.flaticon.com/128/6422/6422278.png" alt="Visa" className="h-8 mx-2" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" className="h-8 mx-2" />
          <img src="https://cdn-icons-png.flaticon.com/128/196/196565.png" alt="PayPal" className="h-8 mx-2" />
          <img src="https://cdn-icons-png.flaticon.com/128/39/39205.png" alt="VeriSign" className="h-8 mx-2" />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-900 text-white py-6">
        <div className="container mx-auto text-center px-4 md:px-8">
          <p>&copy; 2024 Community Connect. All rights reserved.</p>
          <div className="mt-4">
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact Us</Link>
            <span className="mx-2">|</span>
            <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
