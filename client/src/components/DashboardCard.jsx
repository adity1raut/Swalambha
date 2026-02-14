const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  bgColor = 'bg-white', 
  textColor = 'text-gray-900',
  iconColor = 'text-blue-600'
}) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
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
