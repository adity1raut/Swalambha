import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ items = [] }) => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen shadow-lg border-r border-gray-200 dark:border-gray-700 fixed left-0 top-16 transition-colors">
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {items.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-l-4 border-blue-700 dark:border-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {item.icon && (
                  <span className="mr-3 text-xl">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
