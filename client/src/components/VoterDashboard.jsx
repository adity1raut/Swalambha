import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function VoterDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/voter/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.voter);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/voter/login');
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Voter Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h2>Profile Information</h2>
          <div style={styles.profileInfo}>
            <div style={styles.infoRow}>
              <span style={styles.label}>Name:</span>
              <span style={styles.value}>{profile?.name}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Email:</span>
              <span style={styles.value}>{profile?.email}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Voter ID:</span>
              <span style={styles.value}>{profile?.voterId}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Voting Status:</span>
              <span style={{
                ...styles.value,
                color: profile?.hasVoted ? '#28a745' : '#ffc107'
              }}>
                {profile?.hasVoted ? 'Voted' : 'Not Voted'}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Account Status:</span>
              <span style={{
                ...styles.value,
                color: profile?.isActive ? '#28a745' : '#dc3545'
              }}>
                {profile?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {profile?.election && (
          <div style={styles.card}>
            <h2>Election Details</h2>
            <div style={styles.profileInfo}>
              <div style={styles.infoRow}>
                <span style={styles.label}>Election Name:</span>
                <span style={styles.value}>{profile.election.name || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
  content: {
    display: 'grid',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  profileInfo: {
    marginTop: '20px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #eee'
  },
  label: {
    fontWeight: '600',
    color: '#555'
  },
  value: {
    color: '#333'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '20px',
    color: '#666'
  }
};

export default VoterDashboard;