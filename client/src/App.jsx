import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import RoleSelection from './pages/RoleSelection';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import VoterManagement from './pages/admin/VoterManagement';
import CandidateManagement from './pages/admin/CandidateManagement';
import ElectionSetup from './pages/admin/ElectionSetup';
import Results from './pages/admin/Results';

// Voter Pages
import VoterDashboard from './pages/voter/VoterDashboard';
import Elections from './pages/voter/Elections';
import Vote from './pages/voter/Vote';
import CandidateApplication from './pages/voter/CandidateApplication';
import VotingHistory from './pages/voter/VotingHistory';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/voters" element={<VoterManagement />} />
        <Route path="/admin/candidates" element={<CandidateManagement />} />
        <Route path="/admin/elections" element={<ElectionSetup />} />
        <Route path="/admin/results" element={<Results />} />

        {/* Voter Routes */}
        <Route path="/voter/dashboard" element={<VoterDashboard />} />
        <Route path="/voter/elections" element={<Elections />} />
        <Route path="/voter/vote/:electionId" element={<Vote />} />
        <Route path="/voter/candidate-application" element={<CandidateApplication />} />
        <Route path="/voter/history" element={<VotingHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
