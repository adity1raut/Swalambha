import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RoleSelection = () => {
  const roles = [
    {
      title: "Admin",
      description: "Manage elections, voters, candidates, and view results",
      icon: "👨‍💼",
      path: "/admin/dashboard",
      color: "border-blue-500 hover:bg-blue-50",
      features: [
        "Create & manage elections",
        "Approve/reject voters",
        "Manage candidates",
        "Upload voter data via CSV",
        "View election results"
      ]
    },
    {
      title: "Voter",
      description: "View elections, cast votes, and check your voting history",
      icon: "🗳️",
      path: "/voter/dashboard",
      color: "border-green-500 hover:bg-green-50",
      features: [
        "View available elections",
        "Cast your vote securely",
        "Apply as candidate",
        "View voting history",
        "Check election results"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-gray-600">
            Select how you want to access the Election Management System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {roles.map((role, index) => (
            <Link
              key={index}
              to={role.path}
              className={`bg-white rounded-xl shadow-lg border-2 ${role.color} p-8 transform hover:scale-105 transition-all duration-300`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{role.icon}</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {role.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {role.description}
                </p>
                
                <div className="text-left bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Features:</h3>
                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <span className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Continue as {role.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
