import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import { dummyElections, dummyVoters, dummyCandidates } from '../../utils/dummyData';

const AdminDashboard = () => {
  const sidebarItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Voter Management', path: '/admin/voters', icon: '👥' },
    { label: 'Candidate Management', path: '/admin/candidates', icon: '🎯' },
    { label: 'Election Setup', path: '/admin/elections', icon: '🗳️' },
    { label: 'Results', path: '/admin/results', icon: '📈' },
  ];

  const activeElections = dummyElections.filter(e => e.status === 'Active').length;
  const totalVoters = dummyVoters.length;
  const approvedCandidates = dummyCandidates.filter(c => c.status === 'Approved').length;
  const pendingApprovals = dummyVoters.filter(v => v.status === 'Pending').length + 
                          dummyCandidates.filter(c => c.status === 'Pending').length;

  const recentElections = dummyElections.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Admin Panel" />
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to the Election Management System</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Active Elections"
              value={activeElections}
              icon="🗳️"
              description="Currently running"
              iconColor="text-blue-600"
            />
            <DashboardCard
              title="Total Voters"
              value={totalVoters}
              icon="👥"
              description="Registered voters"
              iconColor="text-green-600"
            />
            <DashboardCard
              title="Approved Candidates"
              value={approvedCandidates}
              icon="✅"
              description="Ready to participate"
              iconColor="text-purple-600"
            />
            <DashboardCard
              title="Pending Approvals"
              value={pendingApprovals}
              icon="⏳"
              description="Awaiting review"
              iconColor="text-orange-600"
            />
          </div>

          {/* Recent Elections */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Elections</h2>
            <div className="space-y-4">
              {recentElections.map((election) => (
                <div 
                  key={election.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{election.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{election.description}</p>
                      <div className="flex gap-4 mt-3 text-sm">
                        <span className="text-gray-500">
                          Start: <span className="font-medium text-gray-700">{election.startDate}</span>
                        </span>
                        <span className="text-gray-500">
                          End: <span className="font-medium text-gray-700">{election.endDate}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        election.status === 'Active' ? 'bg-green-100 text-green-800' :
                        election.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {election.status}
                      </span>
                      <div className="mt-3 text-sm text-gray-600">
                        <div>{election.votedCount} / {election.totalVoters} votes</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(election.votedCount / election.totalVoters) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">➕</div>
              <h3 className="font-semibold text-gray-900">Create Election</h3>
              <p className="text-sm text-gray-600 mt-2">Set up a new election</p>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">📤</div>
              <h3 className="font-semibold text-gray-900">Upload Voters</h3>
              <p className="text-sm text-gray-600 mt-2">Bulk upload via CSV/Excel</p>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900">View Reports</h3>
              <p className="text-sm text-gray-600 mt-2">Analytics and insights</p>
            </div>
          </div>

          {/* TODO Comment */}
          {/* TODO: Connect to backend API for real-time data updates */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
