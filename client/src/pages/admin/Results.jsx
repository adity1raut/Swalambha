import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import { dummyResults } from '../../utils/dummyData';

const Results = () => {
  const sidebarItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Voter Management', path: '/admin/voters', icon: '👥' },
    { label: 'Candidate Management', path: '/admin/candidates', icon: '🎯' },
    { label: 'Election Setup', path: '/admin/elections', icon: '🗳️' },
    { label: 'Results', path: '/admin/results', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar title="Admin Panel" />
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Election Results</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">View and analyze election outcomes</p>
          </div>

          {/* Results Display */}
          <div className="space-y-8">
            {dummyResults.map((result, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {result.electionTitle}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Total Votes: <strong className="text-gray-900">{result.totalVotes}</strong></span>
                    <span>Winner: <strong className="text-green-600">{result.winner}</strong></span>
                  </div>
                </div>

                {/* Candidates Results */}
                <div className="space-y-4">
                  {result.candidates
                    .sort((a, b) => b.votes - a.votes)
                    .map((candidate, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            idx === 0 ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {candidate.votes}
                          </div>
                          <div className="text-sm text-gray-600">
                            {candidate.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            idx === 0 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${candidate.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Download/Export Section */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    📥 Download Report (PDF)
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    📊 Export to Excel
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    📧 Email Results
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <DashboardCard
              title="Total Elections"
              value={dummyResults.length}
              icon="🗳️"
              iconColor="text-blue-600"
            />
            <DashboardCard
              title="Total Votes Cast"
              value={dummyResults.reduce((sum, r) => sum + r.totalVotes, 0)}
              icon="✅"
              iconColor="text-green-600"
            />
            <DashboardCard
              title="Average Turnout"
              value={`${((dummyResults.reduce((sum, r) => sum + r.totalVotes, 0) / dummyResults.length) / 5).toFixed(0)}%`}
              icon="📈"
              iconColor="text-purple-600"
            />
          </div>

          {/* TODO: Connect to backend API for real-time results */}
        </div>
      </div>
    </div>
  );
};

export default Results;
