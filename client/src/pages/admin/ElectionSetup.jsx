import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Modal from '../../components/Modal';
import { dummyElections } from '../../utils/dummyData';

const ElectionSetup = () => {
  const [elections, setElections] = useState(dummyElections);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    positions: ''
  });

  const sidebarItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Voter Management', path: '/admin/voters', icon: '👥' },
    { label: 'Candidate Management', path: '/admin/candidates', icon: '🎯' },
    { label: 'Election Setup', path: '/admin/elections', icon: '🗳️' },
    { label: 'Results', path: '/admin/results', icon: '📈' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateElection = (e) => {
    e.preventDefault();
    // TODO: Connect to backend API
    const newElection = {
      id: elections.length + 1,
      ...formData,
      status: 'Upcoming',
      totalVoters: 500,
      votedCount: 0,
      positions: formData.positions.split(',').map(p => p.trim())
    };
    setElections([...elections, newElection]);
    setIsCreateModalOpen(false);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      positions: ''
    });
  };

  const handleDeleteElection = (id) => {
    // TODO: Connect to backend API
    if (confirm('Are you sure you want to delete this election?')) {
      setElections(elections.filter(e => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Admin Panel" />
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Election Setup</h1>
              <p className="text-gray-600 mt-2">Create and manage elections</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              ➕ Create New Election
            </Button>
          </div>

          {/* Elections List */}
          <div className="space-y-6">
            {elections.map((election) => (
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
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        election.status === 'Active' ? 'bg-green-100 text-green-800' :
                        election.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {election.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{election.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-medium text-gray-900">{election.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="font-medium text-gray-900">{election.endDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Voters</p>
                        <p className="font-medium text-gray-900">{election.totalVoters}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Votes Cast</p>
                        <p className="font-medium text-gray-900">{election.votedCount}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Positions:</p>
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

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Voter Turnout</span>
                        <span>{((election.votedCount / election.totalVoters) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(election.votedCount / election.totalVoters) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-4 flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteElection(election.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Election Modal */}
          <Modal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            title="Create New Election"
            footer={
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateElection}>
                  Create Election
                </Button>
              </div>
            }
          >
            <form onSubmit={handleCreateElection}>
              <FormInput
                label="Election Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Student Council Election 2026"
                required
              />
              
              <FormInput
                label="Description"
                type="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the election"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
                
                <FormInput
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <FormInput
                label="Positions (comma-separated)"
                type="text"
                name="positions"
                value={formData.positions}
                onChange={handleInputChange}
                placeholder="President, Vice President, Secretary"
                required
              />

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> After creating the election, you'll need to assign candidates 
                  to positions and configure voter eligibility.
                </p>
              </div>
            </form>
          </Modal>

          {/* TODO: Connect to backend API for election management */}
        </div>
      </div>
    </div>
  );
};

export default ElectionSetup;
