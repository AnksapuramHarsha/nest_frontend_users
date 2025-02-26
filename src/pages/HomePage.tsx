import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-blue-600">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-lg">
        <div className="text-2xl font-bold text-teal-700">
          Meghalaya Hospital
        </div>
        <div className="space-x-6 text-lg">
          <Link to="/login" className="text-teal-700 hover:text-teal-900">
            Login
          </Link>
          <Link to="/register" className="text-teal-700 hover:text-teal-900">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center text-white py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Welcome to Meghalaya Hospital
        </h1>
        <p className="text-lg mb-8">
          Providing compassionate care and excellent medical services.
        </p>
        <Link to="/register">
          <button className="bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-teal-800 transition duration-300">
            Get Started
          </button>
        </Link>
      </section>

      {/* Info Section */}
      <section className="text-center py-12 bg-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-teal-700">
          Our Services
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="w-72 p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-teal-700 mb-4">
              Emergency Care
            </h3>
            <p className="text-gray-700">
              We provide 24/7 emergency care for all patients.
            </p>
          </div>
          <div className="w-72 p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-teal-700 mb-4">
              Specialized Services
            </h3>
            <p className="text-gray-700">
              We have a variety of specialized departments to cater to your needs.
            </p>
          </div>
          <div className="w-72 p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-teal-700 mb-4">
              Surgery and Treatment
            </h3>
            <p className="text-gray-700">
              Our experienced surgeons provide top-notch surgical services.
            </p>
          </div>
        </div>
      </section>

      {/* Footer with Buttons */}
      <footer className="bg-teal-700 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="mb-4">Connect with us for better health solutions.</p>
          <div className="flex justify-center gap-6">
            <Link to="/login">
              <button className="bg-teal-900 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-teal-700 transition duration-300">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-teal-900 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-teal-700 transition duration-300">
                Register
              </button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
