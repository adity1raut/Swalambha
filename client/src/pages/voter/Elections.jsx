import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import { dummyElections } from '../../utils/dummyData';

const Elections = () => {
  const activeElections = dummyElections.filter(e => e.status === 'Active');
  const upcomingElections = dummyElections.filter(e => e.status === 'Upcoming');
  const completedElections = dummyElections.filter(e => e.status === 'Completed');

  const ElectionCard = ({ election }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {election.title}
          </h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            election.status === 'Active' ? 'bg-green-100 text-green-800' :
            election.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {election.status}
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{election.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Start Date:</span>
          <span className="font-medium text-gray-900">{election.startDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">End Date:</span>
          <span className="font-medium text-gray-900">{election.endDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Voter Turnout:</span>
          <span className="font-medium text-gray-900">
            {election.votedCount} / {election.totalVoters} ({((election.votedCount / election.totalVoters) * 100).toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${(election.votedCount / election.totalVoters) * 100}%` }}
        ></div>
      </div>

      {/* Positions */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Positions:</p>
        <div className="flex flex-wrap gap-2">
          {election.positions.map((position, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
            >
              {position}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      {election.status === 'Active' ? (
        <Link to={`/voter/vote/${election.id}`}>
          <Button fullWidth>Vote Now</Button>
        </Link>
      ) : election.status === 'Completed' ? (
        <Button variant="secondary" fullWidth>View Results</Button>
      ) : (
        <Button variant="secondary" fullWidth disabled>Coming Soon</Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Voter Panel" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Elections</h1>
          <p className="text-gray-600 mt-2">View and participate in available elections</p>
        </div>

        {/* Active Elections */}
        {activeElections.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Active Elections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeElections.map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Elections */}
        {upcomingElections.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Elections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingElections.map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Elections */}
        {completedElections.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Completed Elections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedElections.map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link 
            to="/voter/dashboard"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* TODO: Connect to backend API for election data */}
      </div>
    </div>
  );
};

export default Elections;
