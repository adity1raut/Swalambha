const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  bgColor = 'bg-white dark:bg-gray-800', 
  textColor = 'text-gray-900 dark:text-white',
  iconColor = 'text-blue-600 dark:text-blue-400'
}) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{description}</p>
          )}
        </div>
        {icon && (
          <div className={`ml-4 ${iconColor}`}>
            <span className="text-4xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
