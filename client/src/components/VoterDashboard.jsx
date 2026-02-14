import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function VoterDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme, colors } = useTheme();
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

  const getStyles = () => ({
    container: {
      minHeight: '100vh',
      background: colors.gradient,
      padding: '20px',
      transition: 'all 0.3s ease',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: colors.surfaceGlass,
      padding: '25px 30px',
      borderRadius: '20px',
      marginBottom: '30px',
      border: `1px solid ${colors.border}`,
      backdropFilter: 'blur(20px)',
      flexWrap: 'wrap',
      gap: '15px',
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
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #dc143c, #ff4757)'
        : 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(220, 20, 60, 0.3)',
    },
    content: {
      display: 'grid',
      gap: '25px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      background: colors.surfaceGlass,
      padding: '35px',
      borderRadius: '20px',
      border: `1px solid ${colors.border}`,
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
    },
    cardTitle: {
      margin: '0 0 25px 0',
      color: colors.text,
      fontSize: '1.5rem',
      fontWeight: '700',
    },
    profileInfo: {
      marginTop: '20px'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '15px',
      borderBottom: `1px solid ${colors.border}`,
      gap: '20px',
      flexWrap: 'wrap',
    },
    label: {
      fontWeight: '700',
      color: colors.text,
      fontSize: '15px',
    },
    value: {
      color: colors.textSecondary,
      fontSize: '15px',
      fontWeight: '600',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: '20px',
      color: colors.textSecondary,
      background: colors.gradient,
    }
  });

  const styles = getStyles();

  if (loading) {
    return <div style={styles.loading}>⏳ Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span>🗳️</span> Voter Dashboard
        </h1>
        <div style={styles.headerActions}>
          <button
            onClick={toggleTheme}
            style={styles.themeToggle}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 20, 60, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 20, 60, 0.3)';
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div
          style={styles.card}
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
          <h2 style={styles.cardTitle}>👤 Profile Information</h2>
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
                color: profile?.hasVoted ? '#10b981' : '#f59e0b',
                fontWeight: '700',
              }}>
                {profile?.hasVoted ? '✅ Voted' : '⏳ Not Voted'}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Account Status:</span>
              <span style={{
                ...styles.value,
                color: profile?.isActive ? '#10b981' : '#ef4444',
                fontWeight: '700',
              }}>
                {profile?.isActive ? '✅ Active' : '❌ Inactive'}
              </span>
            </div>
          </div>
        </div>

        {profile?.election && (
          <div
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = theme === 'dark'
                ? '0 15px 40px rgba(16, 185, 129, 0.2)'
                : '0 15px 40px rgba(16, 185, 129, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h2 style={styles.cardTitle}>📊 Election Details</h2>
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

export default VoterDashboard;