import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { dummyElections, dummyCandidates } from '../../utils/dummyData';

const Vote = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const election = dummyElections.find(e => e.id === parseInt(electionId));
  
  // Filter candidates for this election (by position)
  const electionCandidates = dummyCandidates.filter(c => 
    election?.positions.includes(c.position) && c.status === 'Approved'
  );

  // Group candidates by position
  const candidatesByPosition = election?.positions.reduce((acc, position) => {
    acc[position] = electionCandidates.filter(c => c.position === position);
    return acc;
  }, {});

  const handleCandidateSelect = (position, candidateId) => {
    setSelectedCandidates(prev => ({
      ...prev,
      [position]: candidateId
    }));
  };

  const handleSubmitVote = () => {
    // Check if all positions have selections
    const allPositionsFilled = election.positions.every(
      position => selectedCandidates[position]
    );

    if (!allPositionsFilled) {
      alert('Please select a candidate for all positions');
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const confirmVote = () => {
    // TODO: Connect to backend API to submit vote
    setIsConfirmModalOpen(false);
    setIsSuccessModalOpen(true);
    
    setTimeout(() => {
      setIsSuccessModalOpen(false);
      navigate('/voter/dashboard');
    }, 2000);
  };

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar title="Voter Panel" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Election Not Found</h2>
            <Button onClick={() => navigate('/voter/elections')}>
              Back to Elections
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar title="Voter Panel" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Election Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{election.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{election.description}</p>
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span>Ends: <strong className="text-gray-900 dark:text-white">{election.endDate}</strong></span>
            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 font-semibold">
              {election.status}
            </span>
          </div>
        </div>

        {/* Voting Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Voting Instructions</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Select one candidate for each position</li>
            <li>Review your selections carefully before submitting</li>
            <li>Once submitted, your vote cannot be changed</li>
            <li>Your vote is confidential and secure</li>
          </ul>
        </div>

        {/* Candidates by Position */}
        <div className="space-y-8">
          {election.positions.map((position) => (
            <div key={position} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{position}</h2>
              
              {candidatesByPosition[position]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidatesByPosition[position].map((candidate) => (
                    <div
                      key={candidate.id}
                      onClick={() => handleCandidateSelect(position, candidate.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedCandidates[position] === candidate.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                            {selectedCandidates[position] === candidate.id && (
                              <span className="text-blue-600">✓</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{candidate.party}</p>
                          <p className="text-sm text-gray-700">{candidate.manifesto}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedCandidates[position] === candidate.id
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedCandidates[position] === candidate.id && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No candidates available for this position.</p>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center gap-4">
          <Button 
            variant="secondary"
            onClick={() => navigate('/voter/elections')}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitVote}
            size="lg"
          >
            Submit Vote
          </Button>
        </div>

        {/* Confirmation Modal */}
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Confirm Your Vote"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsConfirmModalOpen(false)}>
                Review Again
              </Button>
              <Button onClick={confirmVote}>
                Confirm & Submit
              </Button>
            </div>
          }
        >
          <div>
            <p className="text-gray-700 mb-4">
              Please review your selections. Once submitted, your vote cannot be changed.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {Object.entries(selectedCandidates).map(([position, candidateId]) => {
                const candidate = dummyCandidates.find(c => c.id === candidateId);
                return (
                  <div key={position} className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{position}:</span>
                    <span className="text-gray-900">{candidate?.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>

        {/* Success Modal */}
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => {}}
          title="Vote Submitted Successfully!"
        >
          <div className="text-center py-4">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-lg text-gray-700">
              Your vote has been recorded successfully!
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Redirecting to dashboard...
            </p>
          </div>
        </Modal>

        {/* TODO: Connect to backend API for vote submission */}
      </div>
    </div>
  );
};

export default Vote;
