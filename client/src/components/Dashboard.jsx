import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import FileUploadComponent from '../chatbot/FileUploadComponent';
import {getAllElections} from "../contract/Election.js";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme, colors } = useTheme();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Create election form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [electionForm, setElectionForm] = useState({
    title: '',
    description: '',
    regStartDate: '',
    regEndDate: '',
    electionStartDate: '',
    electionEndDate: '',
    voters: [{ name: '', email: '' }]
  });

  // CSV upload state
  const [csvFile, setCsvFile] = useState(null);
  const [uploadingElectionId, setUploadingElectionId] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [voterInputMode, setVoterInputMode] = useState('manual'); // 'manual' or 'csv'
  const [createCsvFile, setCreateCsvFile] = useState(null);

  useEffect(() => {
    if (activeTab === 'elections') {
      fetchElections();
    }
  }, [activeTab]);

const fetchElections = async () => {
  setLoading(true);
  setError('');

  try {
    const onchainElections = await getAllElections();

    // Optional: Format status based on time
    const now = Math.floor(Date.now() / 1000);

    const formatted = onchainElections.map((e) => {
      let status = "UPCOMING";

      if (now >= e.electionStart && now <= e.electionEnd) {
        status = "ONGOING";
      } else if (now > e.electionEnd) {
        status = "COMPLETED";
      }

      return {
        ...e,
        _id: e.electionId, // because your UI expects _id
        title: e.position,
        description: `Election for ${e.position}`,
        startDate: new Date(e.electionStart * 1000),
        endDate: new Date(e.electionEnd * 1000),
        totalVoters: 0,
        totalCandidates: 0,
        status
      };
    });

    setElections(formatted);

  } catch (err) {
    console.error(err);
    setError("Failed to fetch on-chain elections");
  } finally {
    setLoading(false);
  }
};


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const handleElectionFormChange = (e) => {
    setElectionForm({
      ...electionForm,
      [e.target.name]: e.target.value
    });
  };

  const handleVoterChange = (index, field, value) => {
    const newVoters = [...electionForm.voters];
    newVoters[index][field] = value;
    setElectionForm({ ...electionForm, voters: newVoters });
  };

  const addVoter = () => {
    setElectionForm({
      ...electionForm,
      voters: [...electionForm.voters, { name: '', email: '' }]
    });
  };

  const removeVoter = (index) => {
    const newVoters = electionForm.voters.filter((_, i) => i !== index);
    setElectionForm({ ...electionForm, voters: newVoters });
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      if (voterInputMode === 'csv') {
        // Step 1: Create election without voters
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/election/create`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: electionForm.title,
            description: electionForm.description,
            regStartDate: electionForm.regStartDate,
            regEndDate: electionForm.regEndDate,
            electionStartDate: electionForm.electionStartDate,
            electionEndDate: electionForm.electionEndDate,
            voters: [{ name: 'placeholder', email: 'placeholder@temp.com' }]
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Failed to create election');
          return;
        }

        // Step 2: Upload CSV to the created election
        const formData = new FormData();
        formData.append('voterFile', createCsvFile);

        const csvResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/election/${data.election.id}/upload-voters`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
          }
        );

        const csvData = await csvResponse.json();

        if (csvResponse.ok) {
          setSuccess(`Election created! ${csvData.message}`);
        } else {
          setSuccess('Election created, but CSV upload failed: ' + (csvData.message || 'Unknown error'));
        }
      } else {
        // Manual voter entry
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/election/create`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(electionForm)
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Failed to create election');
          return;
        }

        setSuccess('Election created successfully! Voter credentials have been sent via email.');
      }

      setElectionForm({ 
        title: '', 
        description: '', 
        regStartDate: '',
        regEndDate: '',
        electionStartDate: '',
        electionEndDate: '',
        voters: [{ name: '', email: '' }] 
      });
      setCreateCsvFile(null);
      setVoterInputMode('manual');
      setShowCreateForm(false);
      fetchElections();
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Create election error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteElection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this election?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/election/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Election deleted successfully');
        fetchElections();
      } else {
        setError('Failed to delete election');
      }
    } catch (err) {
      setError('Network error');
      console.error('Delete error:', err);
    }
  };

  const handleCSVUpload = async (electionId) => {
    if (!csvFile) {
      setError('Please select a CSV file');
      return;
    }

    setUploadLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('voterFile', csvFile);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/election/${electionId}/upload-voters`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Voters uploaded successfully!');
        setCsvFile(null);
        setUploadingElectionId(null);
        fetchElections();
      } else {
        setError(data.message || 'Failed to upload CSV');
      }
    } catch (err) {
      setError('Network error during CSV upload');
      console.error('CSV upload error:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/election/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setSuccess('Election status updated');
        fetchElections();
      } else {
        setError('Failed to update status');
      }
    } catch (err) {
      setError('Network error');
      console.error('Update error:', err);
    }
  };

  const getStyles = () => ({
    container: {
      minHeight: '100vh',
      height: '100vh',
      background: colors.gradient,
      padding: '0',
      margin: '0',
      fontFamily: 'Arial, sans-serif',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
    },
    dashboard: {
      width: '100%',
      height: '100%',
      background: colors.surface,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '30px 40px',
      borderBottom: `1px solid ${colors.border}`,
      background: colors.cardGradient,
    },
    title: {
      margin: 0,
      color: colors.text,
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
      fontWeight: '800',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    headerActions: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    themeToggle: {
      padding: '10px 20px',
      background: colors.surfaceGlass,
      border: `2px solid ${colors.border}`,
      borderRadius: '20px',
      color: colors.text,
      cursor: 'pointer',
      fontSize: '18px',
      transition: 'all 0.3s ease',
    },
    logoutButton: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
    },
    tabs: {
      display: 'flex',
      borderBottom: `1px solid ${colors.border}`,
      background: theme === 'dark'
        ? 'rgba(20, 20, 20, 0.5)'
        : 'rgba(248, 250, 252, 0.5)',
      padding: '0 20px',
      gap: '10px',
      flexWrap: 'wrap',
    },
    tab: {
      padding: '18px 35px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      color: colors.textSecondary,
      transition: 'all 0.3s ease',
      position: 'relative',
      borderRadius: '12px 12px 0 0',
    },
    activeTab: {
      color: theme === 'dark' ? colors.primary : colors.dashPrimary,
      background: colors.cardGradient,
    },
    tabContent: {
      padding: '40px',
    },
    subtitle: {
      marginTop: 0,
      marginBottom: '30px',
      color: colors.text,
      fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
      fontWeight: '700',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '25px',
      marginBottom: '40px',
    },
    statCard: {
      background: colors.cardGradient,
      padding: '30px',
      borderRadius: '20px',
      textAlign: 'center',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    },
    statNumber: {
      margin: '0 0 15px 0',
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      color: theme === 'dark' ? colors.dashSecondary : colors.dashPrimary,
      fontWeight: '900',
    },
    statLabel: {
      margin: 0,
      color: colors.textSecondary,
      fontSize: '15px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    userInfo: {
      background: colors.cardGradient,
      padding: '30px',
      borderRadius: '20px',
      border: `1px solid ${colors.border}`,
      color: colors.text,
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      flexWrap: 'wrap',
      gap: '15px',
    },
    createButton: {
      padding: '14px 28px',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #10b981, #059669)'
        : 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    },
    createForm: {
      background: colors.surfaceGlass,
      padding: '35px',
      borderRadius: '20px',
      marginBottom: '35px',
      border: `1px solid ${colors.border}`,
      backdropFilter: 'blur(10px)',
    },
    formTitle: {
      marginTop: 0,
      marginBottom: '25px',
      color: colors.text,
      fontSize: '1.5rem',
      fontWeight: '700',
    },
    inputGroup: {
      marginBottom: '25px',
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      fontSize: '14px',
      fontWeight: '700',
      color: colors.text,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '15px',
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      outline: 'none',
      boxSizing: 'border-box',
      background: colors.cardBg,
      color: colors.text,
      transition: 'all 0.3s ease',
    },
    votersSection: {
      marginTop: '25px',
      marginBottom: '25px',
    },
    voterHeaderRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '15px',
    },
    modeToggle: {
      display: 'flex',
      gap: '0',
      borderRadius: '12px',
      overflow: 'hidden',
      border: `2px solid ${colors.border}`,
    },
    modeButton: {
      padding: '10px 20px',
      background: colors.cardBg,
      color: colors.textSecondary,
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
    },
    modeButtonActive: {
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
        : 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
    },
    sectionTitle: {
      margin: 0,
      color: colors.text,
      fontSize: '1.2rem',
      fontWeight: '700',
    },
    voterRow: {
      display: 'flex',
      gap: '12px',
      marginBottom: '12px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    removeButton: {
      padding: '12px 18px',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
        : 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
    },
    addVoterButton: {
      padding: '12px 20px',
      background: colors.cardGradient,
      color: colors.text,
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      marginTop: '12px',
      transition: 'all 0.3s ease',
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
        : 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '700',
      marginTop: '15px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
    },
    buttonDisabled: {
      background: '#6c757d',
      cursor: 'not-allowed',
      opacity: 0.6,
    },
    error: {
      padding: '14px',
      background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.08)',
      color: colors.error,
      borderRadius: '12px',
      marginBottom: '25px',
      fontSize: '14px',
      border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
      fontWeight: '600',
    },
    success: {
      padding: '14px',
      background: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
      color: colors.success,
      borderRadius: '12px',
      marginBottom: '25px',
      fontSize: '14px',
      border: `1px solid ${theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
      fontWeight: '600',
    },
    loading: {
      textAlign: 'center',
      padding: '60px',
      color: colors.textSecondary,
      fontSize: '18px',
    },
    electionsList: {
      display: 'grid',
      gap: '25px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      color: colors.textSecondary,
      fontSize: '16px',
    },
    electionCard: {
      background: colors.surfaceGlass,
      border: `1px solid ${colors.border}`,
      borderRadius: '20px',
      padding: '30px',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    },
    electionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      flexWrap: 'wrap',
      gap: '15px',
    },
    electionTitle: {
      margin: 0,
      color: colors.text,
      fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
      fontWeight: '700',
    },
    statusBadge: {
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    statusDRAFT: {
      background: theme === 'dark' ? 'rgba(156, 163, 175, 0.2)' : 'rgba(156, 163, 175, 0.15)',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
      border: `1px solid ${theme === 'dark' ? 'rgba(156, 163, 175, 0.3)' : 'rgba(156, 163, 175, 0.25)'}`,
    },
    statusUPCOMING: {
      background: theme === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)',
      color: colors.warning,
      border: `1px solid ${theme === 'dark' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.25)'}`,
    },
    statusONGOING: {
      background: theme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)',
      color: colors.success,
      border: `1px solid ${theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.25)'}`,
    },
    statusCOMPLETED: {
      background: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)',
      color: theme === 'dark' ? '#3b82f6' : '#2563eb',
      border: `1px solid ${theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)'}`,
    },
    electionDescription: {
      color: colors.textSecondary,
      marginBottom: '20px',
      lineHeight: '1.6',
    },
    electionMeta: {
      display: 'flex',
      gap: '25px',
      fontSize: '14px',
      color: colors.textSecondary,
      marginBottom: '20px',
      flexWrap: 'wrap',
      fontWeight: '600',
    },
    electionActions: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    statusSelect: {
      padding: '10px 14px',
      border: `2px solid ${colors.border}`,
      borderRadius: '10px',
      fontSize: '14px',
      cursor: 'pointer',
      background: colors.cardBg,
      color: colors.text,
      fontWeight: '600',
    },
    viewButton: {
      padding: '10px 20px',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
        : 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
    },
    deleteButton: {
      padding: '10px 20px',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
        : 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
    },
    uploadToggleButton: {
      padding: '10px 20px',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
        : 'linear-gradient(135deg, #14b8a6, #0d9488)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
    },
    csvUploadSection: {
      marginTop: '20px',
      padding: '20px',
      background: theme === 'dark'
        ? 'rgba(20, 184, 166, 0.1)'
        : 'rgba(240, 253, 250, 1)',
      borderRadius: '12px',
      border: theme === 'dark'
        ? '2px dashed rgba(20, 184, 166, 0.3)'
        : '2px dashed #14b8a6',
    },
    csvHint: {
      margin: '0 0 12px 0',
      fontSize: '14px',
      color: colors.textSecondary,
    },
    csvInputRow: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    fileInput: {
      fontSize: '14px',
      flex: 1,
      padding: '10px',
      border: `2px solid ${colors.border}`,
      borderRadius: '10px',
      background: colors.cardBg,
      color: colors.text,
    },
    csvSubmitButton: {
      padding: '12px 24px',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
        : 'linear-gradient(135deg, #14b8a6, #0d9488)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '700',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease',
    },
    // Sidebar styles
    dashboardLayout: {
      display: 'flex',
      height: '100%',
      position: 'relative',
    },
    sidebar: {
      width: '280px',
      height: '100%',
      background: colors.sidebarBg || colors.surface,
      borderRight: `1px solid ${colors.border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
    },
    sidebarHeader: {
      padding: '30px 25px',
      borderBottom: `1px solid ${colors.border}`,
    },
    sidebarTitle: {
      margin: 0,
      fontSize: '1.5rem',
      fontWeight: '800',
      color: colors.text,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    sidebarNav: {
      flex: 1,
      padding: '20px 15px',
      overflowY: 'auto',
    },
    sidebarItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '16px 20px',
      margin: '8px 0',
      background: 'transparent',
      border: 'none',
      borderRadius: '12px',
      color: colors.textSecondary,
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      width: '100%',
      textAlign: 'left',
      transition: 'all 0.3s ease',
    },
    sidebarItemActive: {
      background: theme === 'dark' 
        ? 'rgba(37, 99, 235, 0.2)' 
        : 'rgba(37, 99, 235, 0.1)',
      color: colors.primary,
    },
    sidebarFooter: {
      padding: '20px',
      borderTop: `1px solid ${colors.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 30px',
      borderBottom: `1px solid ${colors.border}`,
      background: colors.cardGradient,
    },
    mobileMenuButton: {
      display: 'none',
      padding: '10px 15px',
      background: colors.surfaceGlass,
      border: `2px solid ${colors.border}`,
      borderRadius: '10px',
      color: colors.text,
      cursor: 'pointer',
      fontSize: '20px',
      transition: 'all 0.3s ease',
    },
    pageTitle: {
      margin: 0,
      fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
      fontWeight: '700',
      color: colors.text,
    },
    overlay: {
      display: isMobileMenuOpen ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1999,
    },
    contentArea: {
      flex: 1,
      padding: '30px',
      overflowY: 'auto',
    },
    comingSoonCard: {
      background: colors.cardGradient,
      padding: '60px 40px',
      borderRadius: '20px',
      textAlign: 'center',
      border: `1px solid ${colors.border}`,
    },
    comingSoonTitle: {
      fontSize: '2rem',
      fontWeight: '800',
      marginBottom: '15px',
      color: colors.text,
    },
    comingSoonText: {
      fontSize: '1.1rem',
      color: colors.textSecondary,
      marginBottom: '30px',
    },
    '@media (max-width: 768px)': {
      sidebar: {
        width: '280px',
      },
      mobileMenuButton: {
        display: 'block',
      },
    }
  });

  const styles = getStyles();

  const renderOverview = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.subtitle}>Welcome, {user?.email}</h2>
      <div style={styles.statsGrid}>
        <div
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = theme === 'dark'
              ? '0 15px 40px rgba(59, 130, 246, 0.3)'
              : '0 15px 40px rgba(37, 99, 235, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 style={styles.statNumber}>{elections.length}</h3>
          <p style={styles.statLabel}>Total Elections</p>
        </div>
        <div
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = theme === 'dark'
              ? '0 15px 40px rgba(16, 185, 129, 0.3)'
              : '0 15px 40px rgba(16, 185, 129, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 style={styles.statNumber}>
            {elections.filter(e => e.status === 'ONGOING').length}
          </h3>
          <p style={styles.statLabel}>Active Elections</p>
        </div>
        <div
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(37, 99, 235, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 style={styles.statNumber}>
            {elections.filter(e => e.status === 'COMPLETED').length}
          </h3>
          <p style={styles.statLabel}>Completed</p>
        </div>
      </div>
      
      <div style={styles.userInfo}>
        <p style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
          <strong>Role:</strong> <span style={{ textTransform: 'uppercase' }}>{user?.role}</span>
        </p>
        <p style={{ margin: 0, fontSize: '16px' }}>
          <strong>Last Login:</strong> {new Date(user?.lastLogin).toLocaleString()}
        </p>
      </div>
    </div>
  );

  const renderElections = () => (
    <div style={styles.tabContent}>
      {error && <div style={styles.error}>❌ {error}</div>}
      {success && <div style={styles.success}>✅ {success}</div>}

      <div style={styles.headerRow}>
        <h2 style={styles.subtitle}>Elections</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={styles.createButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
          }}
        >
          {showCreateForm ? '✕ Cancel' : '+ Create Election'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateElection} style={styles.createForm}>
          <h3 style={styles.formTitle}>Create New Election</h3>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Election Title *</label>
            <input
              type="text"
              name="title"
              value={electionForm.title}
              onChange={handleElectionFormChange}
              required
              style={styles.input}
              placeholder="e.g., Student Council Election 2026"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={electionForm.description}
              onChange={handleElectionFormChange}
              style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
              placeholder="Election description (optional)..."
            />
          </div>

          <div style={{ ...styles.inputGroup, marginTop: '25px' }}>
            <h4 style={{ ...styles.sectionTitle, marginBottom: '20px' }}>📅 Registration Period</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={styles.label}>Registration Start Date & Time *</label>
                <input
                  type="datetime-local"
                  name="regStartDate"
                  value={electionForm.regStartDate}
                  onChange={handleElectionFormChange}
                  required
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Registration End Date & Time *</label>
                <input
                  type="datetime-local"
                  name="regEndDate"
                  value={electionForm.regEndDate}
                  onChange={handleElectionFormChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={{ ...styles.inputGroup, marginTop: '25px' }}>
            <h4 style={{ ...styles.sectionTitle, marginBottom: '20px' }}>🗳️ Election Period</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={styles.label}>Election Start Date & Time *</label>
                <input
                  type="datetime-local"
                  name="electionStartDate"
                  value={electionForm.electionStartDate}
                  onChange={handleElectionFormChange}
                  required
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Election End Date & Time *</label>
                <input
                  type="datetime-local"
                  name="electionEndDate"
                  value={electionForm.electionEndDate}
                  onChange={handleElectionFormChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={styles.votersSection}>
            <div style={styles.voterHeaderRow}>
              <h4 style={styles.sectionTitle}>Voters</h4>
              <div style={styles.modeToggle}>
                <button
                  type="button"
                  onClick={() => setVoterInputMode('manual')}
                  style={{
                    ...styles.modeButton,
                    ...(voterInputMode === 'manual' ? styles.modeButtonActive : {})
                  }}
                >
                  ✍️ Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => setVoterInputMode('csv')}
                  style={{
                    ...styles.modeButton,
                    ...(voterInputMode === 'csv' ? styles.modeButtonActive : {})
                  }}
                >
                  📁 Upload CSV
                </button>
              </div>
            </div>

            {voterInputMode === 'manual' ? (
              <>
                {electionForm.voters.map((voter, index) => (
                  <div key={index} style={styles.voterRow}>
                    <input
                      type="text"
                      value={voter.name}
                      onChange={(e) => handleVoterChange(index, 'name', e.target.value)}
                      placeholder="Voter Name *"
                      required
                      style={{ ...styles.input, flex: 1, minWidth: '200px' }}
                    />
                    <input
                      type="email"
                      value={voter.email}
                      onChange={(e) => handleVoterChange(index, 'email', e.target.value)}
                      placeholder="Voter Email *"
                      required
                      style={{ ...styles.input, flex: 1, minWidth: '200px' }}
                    />
                    {electionForm.voters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVoter(index)}
                        style={styles.removeButton}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVoter}
                  style={styles.addVoterButton}
                >
                  + Add Voter
                </button>
              </>
            ) : (
              <div style={styles.csvUploadSection}>
                <p style={styles.csvHint}>
                  📋 Upload a CSV file with <strong>name</strong> and <strong>email</strong> columns.
                  Other columns will be ignored. Passwords will be auto-generated and emailed.
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCreateCsvFile(e.target.files[0] || null)}
                  style={styles.fileInput}
                />
                {createCsvFile && (
                  <p style={{ margin: '12px 0 0', fontSize: '14px', color: colors.success, fontWeight: '600' }}>
                    ✓ Selected: {createCsvFile.name}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (voterInputMode === 'csv' && !createCsvFile)}
            style={{
              ...styles.submitButton,
              ...(loading || (voterInputMode === 'csv' && !createCsvFile) ? styles.buttonDisabled : {})
            }}
          >
            {loading
              ? '⏳ Creating...'
              : voterInputMode === 'csv'
                ? '🚀 Create Election & Upload CSV'
                : '🚀 Create Election & Send Credentials'}
          </button>
        </form>
      )}

      {loading && !showCreateForm ? (
        <div style={styles.loading}>⏳ Loading elections...</div>
      ) : (
        <div style={styles.electionsList}>
          {elections.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={{ fontSize: '18px' }}>📭 No elections found. Create your first election!</p>
            </div>
          ) : (
            elections.map((election) => (
              <div
                key={election._id}
                style={styles.electionCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = theme === 'dark'
                    ? '0 15px 40px rgba(59, 130, 246, 0.2)'
                    : '0 15px 40px rgba(37, 99, 235, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.electionHeader}>
                  <h3 style={styles.electionTitle}>{election.title}</h3>
                  <span style={{
                    ...styles.statusBadge,
                    ...styles[`status${election.status}`]
                  }}>
                    {election.status}
                  </span>
                </div>
                
                {election.description && (
                  <p style={styles.electionDescription}>{election.description}</p>
                )}
                
                <div style={styles.electionMeta}>
                  <p>📅 {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}</p>
                  <p>👥 {election.totalVoters} voters</p>
                  <p>📊 {election.totalCandidates || 0} candidates</p>
                </div>

                <div style={styles.electionActions}>
                  <select
                    value={election.status}
                    onChange={(e) => handleStatusChange(election._id, e.target.value)}
                    style={styles.statusSelect}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>

                  <button
                    onClick={() => navigate(`/election/${election._id}`)}
                    style={styles.viewButton}
                  >
                    📋 View Details
                  </button>

                  <button
                    onClick={() => {
                      setUploadingElectionId(
                        uploadingElectionId === election._id ? null : election._id
                      );
                      setCsvFile(null);
                    }}
                    style={styles.uploadToggleButton}
                  >
                    {uploadingElectionId === election._id ? '✕ Cancel' : '📤 Upload Voters CSV'}
                  </button>

                  {/* <button
                    onClick={() => handleDeleteElection(election._id)}
                    style={styles.deleteButton}
                  >
                    🗑️ Delete
                  </button> */}
                </div>

                {uploadingElectionId === election._id && (
                  <div style={styles.csvUploadSection}>
                    <p style={styles.csvHint}>
                      📋 Upload a CSV file with <strong>name</strong> and <strong>email</strong> columns.
                      Other columns will be ignored.
                    </p>
                    <div style={styles.csvInputRow}>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.files[0] || null)}
                        style={styles.fileInput}
                      />
                      <button
                        onClick={() => handleCSVUpload(election._id)}
                        disabled={!csvFile || uploadLoading}
                        style={{
                          ...styles.csvSubmitButton,
                          ...(!csvFile || uploadLoading ? styles.buttonDisabled : {})
                        }}
                      >
                        {uploadLoading ? '⏳ Uploading...' : '📤 Upload & Send Credentials'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const renderDocuments = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.subtitle}>Document Management</h2>
      <FileUploadComponent />
    </div>
  );

  const renderComingFeatures = () => (
    <div style={styles.tabContent}>
      <div style={styles.comingSoonCard}>
        <h2 style={styles.comingSoonTitle}>🚀 Coming Soon!</h2>
        <p style={styles.comingSoonText}>
          Exciting new features are being developed to enhance your experience.
        </p>
        <p style={styles.comingSoonText}>
          Stay tuned for:
        </p>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          color: colors.textSecondary,
          fontSize: '1rem',
          lineHeight: '2'
        }}>
          <li>📊 Advanced Analytics Dashboard</li>
          <li>🔔 Real-time Notifications</li>
          <li>📱 Mobile App Integration</li>
          <li>🎨 Custom Branding Options</li>
          <li>🔐 Enhanced Security Features</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Mobile overlay */}
      <div 
        style={styles.overlay} 
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div style={styles.dashboard}>
        <div style={styles.dashboardLayout}>
          {/* Sidebar */}
          <aside 
            className={`dashboard-sidebar-mobile ${!isMobileMenuOpen ? 'dashboard-sidebar-hidden' : ''}`}
            style={styles.sidebar}
          >
            <div style={styles.sidebarHeader}>
              <h2 style={styles.sidebarTitle}>
                <span>🎯</span> Admin Portal
              </h2>
            </div>

            <nav style={styles.sidebarNav}>
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  ...styles.sidebarItem,
                  ...(activeTab === 'overview' ? styles.sidebarItemActive : {})
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'overview') {
                    e.currentTarget.style.background = colors.sidebarHover || 'rgba(100, 100, 100, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'overview') {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>📊</span>
                <span>Overview</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('elections');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  ...styles.sidebarItem,
                  ...(activeTab === 'elections' ? styles.sidebarItemActive : {})
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'elections') {
                    e.currentTarget.style.background = colors.sidebarHover || 'rgba(100, 100, 100, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'elections') {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>🗳️</span>
                <span>Elections</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('documents');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  ...styles.sidebarItem,
                  ...(activeTab === 'documents' ? styles.sidebarItemActive : {})
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'documents') {
                    e.currentTarget.style.background = colors.sidebarHover || 'rgba(100, 100, 100, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'documents') {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>📄</span>
                <span>Documents</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('coming');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  ...styles.sidebarItem,
                  ...(activeTab === 'coming' ? styles.sidebarItemActive : {})
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'coming') {
                    e.currentTarget.style.background = colors.sidebarHover || 'rgba(100, 100, 100, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'coming') {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>🚀</span>
                <span>Coming Features</span>
              </button>
            </nav>

            <div style={styles.sidebarFooter}>
              <button
                onClick={toggleTheme}
                style={styles.themeToggle}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                <span style={{ marginLeft: '8px' }}>
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
              <button
                onClick={handleLogout}
                style={styles.logoutButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                }}
              >
                🚪 Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main style={styles.mainContent}>
            {/* Top Bar */}
            <div style={styles.topBar}>
              <button
                className="dashboard-mobile-menu-btn"
                style={styles.mobileMenuButton}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                ☰
              </button>
              <h1 style={styles.pageTitle}>
                {activeTab === 'overview' && '📊 Dashboard Overview'}
                {activeTab === 'elections' && '🗳️ Manage Elections'}
                {activeTab === 'documents' && '📄 Document Management'}
                {activeTab === 'coming' && '🚀 Coming Features'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: '14px', 
                  color: colors.textSecondary,
                  fontWeight: '600'
                }}>
                  👤 {user?.fullName || 'Admin'}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div style={styles.contentArea}>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'elections' && renderElections()}
              {activeTab === 'documents' && renderDocuments()}
              {activeTab === 'coming' && renderComingFeatures()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
