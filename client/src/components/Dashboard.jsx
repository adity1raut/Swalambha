import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Create election form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [electionForm, setElectionForm] = useState({
    title: '',
    description: '',
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
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/election/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        setElections(data.elections);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch elections');
      console.error('Fetch error:', err);
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

      setElectionForm({ title: '', description: '', voters: [{ name: '', email: '' }] });
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

  const renderOverview = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.subtitle}>Welcome, {user?.email}</h2>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{elections.length}</h3>
          <p style={styles.statLabel}>Total Elections</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {elections.filter(e => e.status === 'ONGOING').length}
          </h3>
          <p style={styles.statLabel}>Active Elections</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {elections.filter(e => e.status === 'COMPLETED').length}
          </h3>
          <p style={styles.statLabel}>Completed</p>
        </div>
      </div>
      
      <div style={styles.userInfo}>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Last Login:</strong> {new Date(user?.lastLogin).toLocaleString()}</p>
      </div>
    </div>
  );

  const renderElections = () => (
    <div style={styles.tabContent}>
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.headerRow}>
        <h2 style={styles.subtitle}>Elections</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={styles.createButton}
        >
          {showCreateForm ? 'Cancel' : '+ Create Election'}
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
              style={{ ...styles.input, minHeight: '80px' }}
              placeholder="Election description (optional)..."
            />
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
                  Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => setVoterInputMode('csv')}
                  style={{
                    ...styles.modeButton,
                    ...(voterInputMode === 'csv' ? styles.modeButtonActive : {})
                  }}
                >
                  Upload CSV
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
                      style={{ ...styles.input, flex: 1 }}
                    />
                    <input
                      type="email"
                      value={voter.email}
                      onChange={(e) => handleVoterChange(index, 'email', e.target.value)}
                      placeholder="Voter Email *"
                      required
                      style={{ ...styles.input, flex: 1 }}
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
                  Upload a CSV file with <strong>name</strong> and <strong>email</strong> columns.
                  Other columns will be ignored. Passwords will be auto-generated and emailed.
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCreateCsvFile(e.target.files[0] || null)}
                  style={styles.fileInput}
                />
                {createCsvFile && (
                  <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#28a745' }}>
                    Selected: {createCsvFile.name}
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
              ? 'Creating...'
              : voterInputMode === 'csv'
                ? 'Create Election & Upload CSV'
                : 'Create Election & Send Credentials'}
          </button>
        </form>
      )}

      {loading && !showCreateForm ? (
        <div style={styles.loading}>Loading elections...</div>
      ) : (
        <div style={styles.electionsList}>
          {elections.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No elections found. Create your first election!</p>
            </div>
          ) : (
            elections.map((election) => (
              <div key={election._id} style={styles.electionCard}>
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
                    View Details
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
                    {uploadingElectionId === election._id ? 'Cancel Upload' : 'Upload Voters CSV'}
                  </button>

                  <button
                    onClick={() => handleDeleteElection(election._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>

                {uploadingElectionId === election._id && (
                  <div style={styles.csvUploadSection}>
                    <p style={styles.csvHint}>
                      Upload a CSV file with <strong>name</strong> and <strong>email</strong> columns.
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
                        {uploadLoading ? 'Uploading...' : 'Upload & Send Credentials'}
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

  return (
    <div style={styles.container}>
      <div style={styles.dashboard}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>

        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              ...styles.tab,
              ...(activeTab === 'overview' ? styles.activeTab : {})
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('elections')}
            style={{
              ...styles.tab,
              ...(activeTab === 'elections' ? styles.activeTab : {})
            }}
          >
            Elections
          </button>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'elections' && renderElections()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  dashboard: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px 40px',
    borderBottom: '1px solid #e0e0e0'
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '28px'
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fafafa'
  },
  tab: {
    padding: '15px 30px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.3s'
  },
  activeTab: {
    color: '#007bff',
    borderBottom: '3px solid #007bff',
    backgroundColor: 'white'
  },
  tabContent: {
    padding: '40px'
  },
  subtitle: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#333',
    fontSize: '22px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '25px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e0e0e0'
  },
  statNumber: {
    margin: '0 0 10px 0',
    fontSize: '36px',
    color: '#007bff',
    fontWeight: 'bold'
  },
  statLabel: {
    margin: 0,
    color: '#666',
    fontSize: '14px'
  },
  userInfo: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  createForm: {
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '30px',
    border: '1px solid #e0e0e0'
  },
  formTitle: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#333'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  dateRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  votersSection: {
    marginTop: '20px',
    marginBottom: '20px'
  },
  voterHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  modeToggle: {
    display: 'flex',
    gap: '0',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid #ddd'
  },
  modeButton: {
    padding: '6px 14px',
    backgroundColor: '#f8f9fa',
    color: '#555',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500'
  },
  modeButtonActive: {
    backgroundColor: '#007bff',
    color: 'white'
  },
  sectionTitle: {
    margin: 0,
    color: '#333'
  },
  voterRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
    alignItems: 'center'
  },
  removeButton: {
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  addVoterButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px'
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px'
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed'
  },
  error: {
    padding: '12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  success: {
    padding: '12px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  electionsList: {
    display: 'grid',
    gap: '20px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666'
  },
  electionCard: {
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    transition: 'box-shadow 0.3s'
  },
  electionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  electionTitle: {
    margin: 0,
    color: '#333',
    fontSize: '20px'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusDRAFT: {
    backgroundColor: '#e0e0e0',
    color: '#666'
  },
  statusUPCOMING: {
    backgroundColor: '#fff3cd',
    color: '#856404'
  },
  statusONGOING: {
    backgroundColor: '#d4edda',
    color: '#155724'
  },
  statusCOMPLETED: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460'
  },
  electionDescription: {
    color: '#666',
    marginBottom: '15px'
  },
  electionMeta: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    flexWrap: 'wrap'
  },
  electionActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  statusSelect: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  viewButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  uploadToggleButton: {
    padding: '8px 16px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  csvUploadSection: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#f0f8ff',
    borderRadius: '6px',
    border: '1px dashed #17a2b8'
  },
  csvHint: {
    margin: '0 0 10px 0',
    fontSize: '13px',
    color: '#555'
  },
  csvInputRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  fileInput: {
    fontSize: '14px',
    flex: 1
  },
  csvSubmitButton: {
    padding: '10px 20px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  }
};

export default Dashboard;