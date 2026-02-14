import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Secure & Transparent
            <span className="block text-blue-600 dark:text-blue-400 mt-2">Digital Election System</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            A modern platform for secure, transparent, and efficient election management.
          </p>
          
          {/* CTA Button */}
          <div className="flex justify-center">
            <Link 
              to="/login"
              className="px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transform hover:scale-105 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Secure Voting
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              End-to-end encrypted voting system ensuring complete privacy and security.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Fast & Efficient
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Streamlined process for quick and efficient election management.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Real-time Results
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Live election results and analytics with transparent reporting.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2026 Election Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
