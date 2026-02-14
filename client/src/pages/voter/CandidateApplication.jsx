import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { dummyElections } from '../../utils/dummyData';

const CandidateApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    position: '',
    party: '',
    manifesto: '',
    electionId: '',
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const availableElections = dummyElections.filter(
    e => e.status === 'Active' || e.status === 'Upcoming'
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend API to submit candidate application
    console.log('Candidate Application:', formData);
    setIsSuccessModalOpen(true);
    
    setTimeout(() => {
      setIsSuccessModalOpen(false);
      navigate('/voter/dashboard');
    }, 2500);
  };

  const selectedElection = availableElections.find(
    e => e.id === parseInt(formData.electionId)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Voter Panel" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Apply as Candidate</h1>
          <p className="text-gray-600 mt-2">Submit your candidacy for election positions</p>
        </div>

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Application Guidelines</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Fill all required fields accurately</li>
            <li>Your manifesto should clearly state your goals and vision</li>
            <li>Applications will be reviewed by the admin team</li>
            <li>You'll be notified once your application is approved or rejected</li>
            <li>Approved candidates will appear in the voting interface</li>
          </ul>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Select Election"
              type="select"
              name="electionId"
              value={formData.electionId}
              onChange={handleInputChange}
              required
              options={availableElections.map(e => ({
                value: e.id,
                label: e.title
              }))}
            />

            {selectedElection && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Available Positions:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedElection.positions.map((pos, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {pos}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <FormInput
              label="Position"
              type="select"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
              options={selectedElection 
                ? selectedElection.positions.map(p => ({ value: p, label: p }))
                : []
              }
              disabled={!formData.electionId}
            />

            <FormInput
              label="Party / Affiliation"
              type="text"
              name="party"
              value={formData.party}
              onChange={handleInputChange}
              placeholder="e.g., Independent, Progressive Party, etc."
              required
            />

            <FormInput
              label="Your Manifesto"
              type="textarea"
              name="manifesto"
              value={formData.manifesto}
              onChange={handleInputChange}
              placeholder="Describe your goals, vision, and what you plan to achieve if elected..."
              rows={6}
              required
            />

            {/* Candidate Information Card */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Your Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-900">Current User (Demo)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">user@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Voter ID:</span>
                  <span className="font-medium text-gray-900">V001</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * This information will be automatically filled from your profile
              </p>
            </div>

            {/* Agreement */}
            <div className="mb-6">
              <label className="flex items-start">
                <input 
                  type="checkbox" 
                  required 
                  className="mt-1 mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I confirm that all information provided is accurate and I agree to abide by 
                  the election code of conduct.
                </span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button 
                variant="secondary"
                type="button"
                onClick={() => navigate('/voter/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" fullWidth>
                Submit Application
              </Button>
            </div>
          </form>
        </div>

        {/* Success Modal */}
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => {}}
          title="Application Submitted!"
        >
          <div className="text-center py-4">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your application has been submitted!
            </h3>
            <p className="text-gray-700 mb-2">
              Your candidacy application is now pending review.
            </p>
            <p className="text-sm text-gray-600">
              You'll be notified once the admin team reviews your application.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Redirecting to dashboard...
            </p>
          </div>
        </Modal>

        {/* TODO: Connect to backend API for candidate applications */}
      </div>
    </div>
  );
};

export default CandidateApplication;
