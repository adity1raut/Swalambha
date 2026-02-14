import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { dummyVotingHistory, dummyElections } from '../../utils/dummyData';

const VotingHistory = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Voter Panel" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Voting History</h1>
          <p className="text-gray-600 mt-2">View your complete voting record</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-sm text-gray-600">Total Votes Cast</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {dummyVotingHistory.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-sm text-gray-600">Participation Rate</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {((dummyVotingHistory.length / dummyElections.filter(e => e.status === 'Completed').length) * 100).toFixed(0)}%
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-sm text-gray-600">Upcoming Elections</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {dummyElections.filter(e => e.status === 'Active' || e.status === 'Upcoming').length}
            </div>
          </div>
        </div>

        {/* Voting History Table */}
        {dummyVotingHistory.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">Your Voting Records</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Election
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Voted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dummyVotingHistory.map((vote) => (
                    <tr key={vote.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{vote.electionTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vote.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vote.votedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {vote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Details Cards */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Detailed Records</h3>
              <div className="space-y-4">
                {dummyVotingHistory.map((vote) => (
                  <div 
                    key={vote.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {vote.electionTitle}
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Position: </span>
                            <span className="font-medium text-gray-900">{vote.position}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Date: </span>
                            <span className="font-medium text-gray-900">{vote.votedDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Vote ID: </span>
                            <span className="font-mono text-xs text-gray-700">
                              VT{vote.id.toString().padStart(6, '0')}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Status: </span>
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              {vote.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          View Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📜</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Voting History
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't participated in any elections yet.
            </p>
            <Link to="/voter/elections">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                View Available Elections
              </button>
            </Link>
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

        {/* TODO: Connect to backend API for voting history */}
      </div>
    </div>
  );
};

export default VotingHistory;
