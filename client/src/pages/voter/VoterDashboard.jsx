import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { dummyElections, dummyVotingHistory } from '../../utils/dummyData';

const VoterDashboard = () => {
  const activeElections = dummyElections.filter(e => e.status === 'Active');
  const upcomingElections = dummyElections.filter(e => e.status === 'Upcoming');
  const votingHistory = dummyVotingHistory;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Voter Panel" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Voter Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your voting overview.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Active Elections"
            value={activeElections.length}
            icon="🗳️"
            iconColor="text-green-600"
          />
          <DashboardCard
            title="Upcoming Elections"
            value={upcomingElections.length}
            icon="📅"
            iconColor="text-blue-600"
          />
          <DashboardCard
            title="Votes Cast"
            value={votingHistory.length}
            icon="✅"
            iconColor="text-purple-600"
          />
          <DashboardCard
            title="Available to Vote"
            value={activeElections.length}
            icon="⏰"
            iconColor="text-orange-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/voter/elections"
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-3">🗳️</div>
            <h3 className="font-semibold text-gray-900 mb-2">View Elections</h3>
            <p className="text-sm text-gray-600">Browse and participate in active elections</p>
          </Link>
          
          <Link
            to="/voter/candidate-application"
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-900 mb-2">Apply as Candidate</h3>
            <p className="text-sm text-gray-600">Submit your candidacy for positions</p>
          </Link>
          
          <Link
            to="/voter/history"
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-3">📜</div>
            <h3 className="font-semibold text-gray-900 mb-2">Voting History</h3>
            <p className="text-sm text-gray-600">View your past voting records</p>
          </Link>
        </div>

        {/* Active Elections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Elections</h2>
          {activeElections.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <p className="text-gray-600">No active elections at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeElections.map((election) => (
                <div 
                  key={election.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {election.title}
                        </h3>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {election.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">{election.description}</p>
                      
                      <div className="flex gap-6 mt-4 text-sm text-gray-600">
                        <span>Ends: <strong className="text-gray-900">{election.endDate}</strong></span>
                        <span>Turnout: <strong className="text-gray-900">{((election.votedCount / election.totalVoters) * 100).toFixed(1)}%</strong></span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/voter/vote/${election.id}`}
                      className="ml-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Vote Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Voting History */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Voting History</h2>
          {votingHistory.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <p className="text-gray-600">You haven't voted in any elections yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Election
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {votingHistory.map((vote) => (
                    <tr key={vote.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{vote.electionTitle}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{vote.position}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{vote.votedDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {vote.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* TODO: Connect to backend API for real voter data */}
      </div>
    </div>
  );
};

export default VoterDashboard;
