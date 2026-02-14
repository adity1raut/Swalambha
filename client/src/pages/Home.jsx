import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const features = [
    {
      title: "Secure Digital Voting",
      description: "End-to-end encrypted voting system ensuring complete privacy and security",
      icon: "🔒"
    },
    {
      title: "Admin Election Management",
      description: "Comprehensive dashboard for managing elections, voters, and candidates",
      icon: "⚙️"
    },
    {
      title: "Candidate Registration",
      description: "Streamlined process for candidate applications and approvals",
      icon: "📝"
    },
    {
      title: "Real-time Results UI",
      description: "Live election results and analytics with interactive visualizations",
      icon: "📊"
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Secure & Transparent
            <span className="block text-blue-600 mt-2">Digital Election System</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            A modern platform for college, school, and organizational elections. 
            Manage voters, candidates, and elections with complete transparency and security.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/login"
              className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all w-64"
            >
              🔐 Login
            </Link>
            <Link 
              to="/admin/dashboard"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all w-64"
            >
              Admin Panel
            </Link>
            <Link 
              to="/voter/dashboard"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg border-2 border-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all w-64"
            >
              Voter Panel
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Register</h3>
            <p className="text-gray-600">
              Admin uploads voter list or voters self-register with credentials
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Vote</h3>
            <p className="text-gray-600">
              Verified voters cast their votes securely during election period
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Results</h3>
            <p className="text-gray-600">
              View transparent results with real-time analytics and reporting
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2026 Election Management System. Built for hackathons and startup demos.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Frontend-only demonstration | No authentication required
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
