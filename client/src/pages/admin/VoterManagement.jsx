import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import { dummyVoters } from '../../utils/dummyData';

const VoterManagement = () => {
  const [voters, setVoters] = useState(dummyVoters);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  const sidebarItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Voter Management', path: '/admin/voters', icon: '👥' },
    { label: 'Candidate Management', path: '/admin/candidates', icon: '🎯' },
    { label: 'Election Setup', path: '/admin/elections', icon: '🗳️' },
    { label: 'Results', path: '/admin/results', icon: '📈' },
  ];

  const columns = [
    { header: 'Voter ID', accessor: 'voterId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Registered Date', accessor: 'registeredDate' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.status === 'Approved' ? 'bg-green-100 text-green-800' :
          row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    { 
      header: 'Voted', 
      accessor: 'hasVoted',
      render: (row) => row.hasVoted ? '✅' : '❌'
    }
  ];

  const handleApprove = (voterId) => {
    // TODO: Connect to backend API
    setVoters(voters.map(v => 
      v.voterId === voterId ? { ...v, status: 'Approved' } : v
    ));
  };

  const handleReject = (voterId) => {
    // TODO: Connect to backend API
    setVoters(voters.map(v => 
      v.voterId === voterId ? { ...v, status: 'Rejected' } : v
    ));
  };

  const handleBlock = (voterId) => {
    // TODO: Connect to backend API
    alert(`Voter ${voterId} has been blocked`);
  };

  const actions = (row) => (
    <div className="flex gap-2">
      {row.status === 'Pending' && (
        <>
          <Button 
            variant="success" 
            size="sm"
            onClick={() => handleApprove(row.voterId)}
          >
            Approve
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => handleReject(row.voterId)}
          >
            Reject
          </Button>
        </>
      )}
      {row.status === 'Approved' && (
        <Button 
          variant="danger" 
          size="sm"
          onClick={() => handleBlock(row.voterId)}
        >
          Block
        </Button>
      )}
    </div>
  );

  const filteredVoters = filter === 'All' 
    ? voters 
    : voters.filter(v => v.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar title="Admin Panel" />
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Voter Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Manage and approve registered voters</p>
            </div>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              📤 Upload CSV/Excel
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Total Voters</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{voters.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Approved</div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {voters.filter(v => v.status === 'Approved').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">
                {voters.filter(v => v.status === 'Pending').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Voted</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {voters.filter(v => v.hasVoted).length}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-2">
            {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Voters Table */}
          <Table columns={columns} data={filteredVoters} actions={actions} />

          {/* Upload Modal */}
          <Modal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            title="Upload Voters"
            footer={
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // TODO: Handle file upload to backend
                  alert('File upload functionality will be connected to backend');
                  setIsUploadModalOpen(false);
                }}>
                  Upload
                </Button>
              </div>
            }
          >
            <div>
              <p className="text-gray-600 mb-4">
                Upload a CSV or Excel file with voter information. Required columns: 
                Name, Email, Voter ID
              </p>
              <FormInput
                label="Select File"
                type="file"
                name="voterFile"
                accept=".csv,.xlsx,.xls"
              />
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Format:</strong> CSV or Excel file<br/>
                  <strong>Columns:</strong> Name, Email, Voter ID, Phone (optional)
                </p>
              </div>
            </div>
          </Modal>

          {/* TODO: Connect to backend API for voter management */}
        </div>
      </div>
    </div>
  );
};

export default VoterManagement;
