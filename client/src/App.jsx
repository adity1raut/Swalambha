import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
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
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
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
    </ThemeProvider>
  );
}

export default App;
