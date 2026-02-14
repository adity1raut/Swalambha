import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ title = "Election Management System" }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  // Check if we're on a dashboard/authenticated page
  const isDashboardPage = location.pathname.startsWith('/voter') || location.pathname.startsWith('/admin');

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center shrink-0">
            <div className="flex items-center cursor-default">
              <div className="shrink-0 flex items-center">
                <svg className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">{title}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {!isDashboardPage && (
              <>
                <Link to="/" className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link to="/login" className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors">
                  Login
                </Link>
              </>
            )}
            
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
