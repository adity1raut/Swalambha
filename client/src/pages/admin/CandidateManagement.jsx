import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { dummyCandidates } from '../../utils/dummyData';

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState(dummyCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Voter Management', path: '/admin/voters', icon: '👥' },
    { label: 'Candidate Management', path: '/admin/candidates', icon: '🎯' },
    { label: 'Election Setup', path: '/admin/elections', icon: '🗳️' },
    { label: 'Results', path: '/admin/results', icon: '📈' },
  ];

  const columns = [
    { header: 'Candidate ID', accessor: 'candidateId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Position', accessor: 'position' },
    { header: 'Party', accessor: 'party' },
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
    }
  ];

  const handleApprove = (candidateId) => {
    // TODO: Connect to backend API
    setCandidates(candidates.map(c => 
      c.candidateId === candidateId ? { ...c, status: 'Approved' } : c
    ));
  };

  const handleReject = (candidateId) => {
    // TODO: Connect to backend API
    setCandidates(candidates.map(c => 
      c.candidateId === candidateId ? { ...c, status: 'Rejected' } : c
    ));
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setIsViewModalOpen(true);
  };

  const actions = (row) => (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleViewDetails(row)}
      >
        View
      </Button>
      {row.status === 'Pending' && (
        <>
          <Button 
            variant="success" 
            size="sm"
            onClick={() => handleApprove(row.candidateId)}
          >
            Approve
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => handleReject(row.candidateId)}
          >
            Reject
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Admin Panel" />
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Candidate Management</h1>
            <p className="text-gray-600 mt-2">Review and approve candidate applications</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Total Candidates</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{candidates.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Approved</div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {candidates.filter(c => c.status === 'Approved').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Pending Review</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">
                {candidates.filter(c => c.status === 'Pending').length}
              </div>
            </div>
          </div>

          {/* Candidates Table */}
          <Table columns={columns} data={candidates} actions={actions} />

          {/* View Details Modal */}
          <Modal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            title="Candidate Details"
            footer={
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                {selectedCandidate?.status === 'Pending' && (
                  <>
                    <Button 
                      variant="success"
                      onClick={() => {
                        handleApprove(selectedCandidate.candidateId);
                        setIsViewModalOpen(false);
                      }}
                    >
                      Approve Candidate
                    </Button>
                    <Button 
                      variant="danger"
                      onClick={() => {
                        handleReject(selectedCandidate.candidateId);
                        setIsViewModalOpen(false);
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            }
          >
            {selectedCandidate && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Name</h4>
                  <p className="text-gray-900">{selectedCandidate.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Email</h4>
                  <p className="text-gray-900">{selectedCandidate.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Position</h4>
                  <p className="text-gray-900">{selectedCandidate.position}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Party</h4>
                  <p className="text-gray-900">{selectedCandidate.party}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Status</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedCandidate.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    selectedCandidate.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedCandidate.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Manifesto</h4>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                    {selectedCandidate.manifesto}
                  </p>
                </div>
              </div>
            )}
          </Modal>

          {/* TODO: Connect to backend API for candidate management */}
        </div>
      </div>
    </div>
  );
};

export default CandidateManagement;
