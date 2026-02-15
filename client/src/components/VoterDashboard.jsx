import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Chatbot from '../chatbot/ChatComponent';
import { getAllElections, getCandidates, getCandidateVotes } from '../contract/Election';

function VoterDashboard() {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme, colors } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [elections, setElections] = useState([]);
  const [userElection, setUserElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Helper functions for localStorage voting tracking
  const getVotingKey = (email, electionId) => {
    return `voted_${email}_${electionId}`;
  };

  const hasVotedForElection = (email, electionId) => {
    const key = getVotingKey(email, electionId);
    return localStorage.getItem(key) === 'true';
  };

  const markAsVoted = (email, electionId) => {
    const key = getVotingKey(email, electionId);
    localStorage.setItem(key, 'true');
  };

  useEffect(() => {
    fetchProfile();
    fetchElections();
  }, []);

  useEffect(() => {
    if (profile && elections.length > 0) {
      findUserElection(profile.email, elections);
    }
  }, [profile, elections]);

  useEffect(() => {
    if (userElection) {
      loadCandidates();
    }
  }, [userElection]);

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

  const fetchElections = async () => {
    try {
      const blockchainElections = await getAllElections();
      setElections(blockchainElections);
    } catch (error) {
      console.error('Error fetching elections:', error);
    }
  };

  const findUserElection = async (email, blockchainElections = elections) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/voter/getElection`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ email })
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.electionTitle) {
          const matchingElection = blockchainElections.find(
            e => e.position.toLowerCase() === data.electionTitle.toLowerCase()
          );

          if (matchingElection) {
            setUserElection(matchingElection);
          }
        }
      }
    } catch (error) {
      console.error('Error finding user election:', error);
    }
  };

  const loadCandidates = async () => {
    if (!userElection) return;

    try {
      const candidateList = await getCandidates(userElection.electionId);
      setCandidates(candidateList);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/voter/login');
  };

  const isRegistrationOpen = () => {
    if (!userElection) return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= userElection.regStart && now <= userElection.regEnd;
  };

  const isVotingOpen = () => {
    if (!userElection) return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= userElection.electionStart && now <= userElection.electionEnd;
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
    tabContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      maxWidth: '1200px',
      margin: '0 auto 25px auto',
    },
    tab: {
      padding: '12px 24px',
      borderRadius: '15px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      color: colors.text,
    },
    activeTab: {
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    },
    inactiveTab: {
      background: colors.surfaceGlass,
      border: `1px solid ${colors.border}`,
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
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    input: {
      padding: '15px',
      borderRadius: '12px',
      border: `2px solid ${colors.border}`,
      background: colors.surfaceGlass,
      color: colors.text,
      fontSize: '15px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    select: {
      padding: '15px',
      borderRadius: '12px',
      border: `2px solid ${colors.border}`,
      background: colors.surfaceGlass,
      color: colors.text,
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    button: {
      padding: '15px 30px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '15px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    candidateList: {
      display: 'grid',
      gap: '15px',
      marginTop: '20px',
    },
    candidateItem: {
      padding: '15px',
      background: colors.surfaceGlass,
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      color: colors.text,
      fontSize: '15px',
    },
    statusBadge: {
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      display: 'inline-block',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: '20px',
      color: colors.textSecondary,
      background: colors.gradient,
    },
    chatbotToggle: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: showChatbot 
        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      color: 'white',
      fontSize: '28px',
      cursor: 'pointer',
      boxShadow: showChatbot
        ? '0 4px 15px rgba(239, 68, 68, 0.4)'
        : '0 4px 15px rgba(102, 126, 234, 0.4)',
      transition: 'all 0.3s ease',
      zIndex: 1000,
      transform: showChatbot ? 'rotate(90deg)' : 'rotate(0deg)',
    },
    winnerBadge: {
      padding: '10px 20px',
      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      color: 'white',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '700',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)',
    },
    resultCard: {
      padding: '20px',
      background: colors.surfaceGlass,
      border: `1px solid ${colors.border}`,
      borderRadius: '15px',
      marginBottom: '15px',
      transition: 'all 0.3s ease',
    },
    resultRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: `1px solid ${colors.border}`,
    },
    voteCount: {
      fontSize: '20px',
      fontWeight: '700',
      color: theme === 'dark' ? '#3b82f6' : '#2563eb',
    },
    progressBar: {
      width: '100%',
      height: '10px',
      background: colors.border,
      borderRadius: '10px',
      overflow: 'hidden',
      marginTop: '8px',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      borderRadius: '10px',
      transition: 'width 0.5s ease',
    },
  });

  const styles = getStyles();

  if (loading) {
    return <div style={styles.loading}>⏳ Loading...</div>;
  }

  const renderProfileTab = () => (
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
  );

  const renderElectionsTab = () => (
    <>
      {userElection && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Your Election Details</h2>
          <div style={styles.profileInfo}>
            <div style={styles.infoRow}>
              <span style={styles.label}>Position:</span>
              <span style={styles.value}>{userElection.position}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Registration Period:</span>
              <span style={styles.value}>
                {new Date(userElection.regStart * 1000).toLocaleDateString()} - {new Date(userElection.regEnd * 1000).toLocaleDateString()}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Election Period:</span>
              <span style={styles.value}>
                {new Date(userElection.electionStart * 1000).toLocaleDateString()} - {new Date(userElection.electionEnd * 1000).toLocaleDateString()}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Registration Status:</span>
              <span style={{
                ...styles.statusBadge,
                background: isRegistrationOpen() ? '#10b981' : '#6b7280',
                color: 'white',
              }}>
                {isRegistrationOpen() ? '🟢 Open' : '🔴 Closed'}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Voting Status:</span>
              <span style={{
                ...styles.statusBadge,
                background: isVotingOpen() ? '#10b981' : '#6b7280',
                color: 'white',
              }}>
                {isVotingOpen() ? '🟢 Open' : '🔴 Closed'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🗳️ All Elections</h2>
        <div style={styles.candidateList}>
          {elections.length === 0 ? (
            <p style={{ color: colors.textSecondary }}>No elections available</p>
          ) : (
            elections.map((election) => (
              <div key={election.electionId} style={styles.candidateItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                  <strong style={{ fontSize: '16px' }}>ID: {election.electionId}</strong>
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>{election.position}</span>
                </div>
                <div style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '6px' }}>
                  📝 Registration: {new Date(election.regStart * 1000).toLocaleDateString()} - {new Date(election.regEnd * 1000).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '14px', color: colors.textSecondary }}>
                  🗳️ Voting: {new Date(election.electionStart * 1000).toLocaleDateString()} - {new Date(election.electionEnd * 1000).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );

  const ElectionRegistrationCard = ({ election }) => {
    const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
      const checkRegistration = async () => {
        try {
          const candidateList = await getCandidates(election.electionId);
          setIsAlreadyRegistered(candidateList.includes(profile?.email));
        } catch (error) {
          console.error('Error checking registration:', error);
        } finally {
          setCheckingStatus(false);
        }
      };
      
      checkRegistration();
    }, [election.electionId]);

    const handleRegisterForElection = async () => {
      if (!profile?.email) {
        alert('User email not found');
        return;
      }

      try {
        setIsRegistering(true);

        const candidateList = await getCandidates(election.electionId);
        
        if (candidateList.includes(profile.email)) {
          alert('You are already registered as a candidate for this election!');
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/voter/addCandidate`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              electionId: election.electionId,
              email: profile.email
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            alert(`Successfully registered as candidate for ${election.position}!`);
            await fetchElections();
            if (userElection && userElection.electionId === election.electionId) {
              setTimeout(() => loadCandidates(), 2000);
            }
            setIsAlreadyRegistered(true);
          } else {
            alert(`Registration failed: ${data.error || 'Unknown error'}`);
          }
        } else {
          const error = await response.json();
          alert(`Registration failed: ${error.error || error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error registering for election:', error);
        alert('Error registering as candidate');
      } finally {
        setIsRegistering(false);
      }
    };

    const regOpen = Math.floor(Date.now() / 1000) >= election.regStart && Math.floor(Date.now() / 1000) <= election.regEnd;

    return (
      <div 
        key={election.electionId} 
        style={{ 
          ...styles.candidateItem, 
          marginBottom: '15px',
          border: regOpen ? `2px solid #10b981` : `1px solid ${colors.border}`,
          padding: '20px'
        }}
      >
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong style={{ fontSize: '18px', color: colors.text }}>{election.position}</strong>
            <span style={{ fontSize: '14px', color: colors.textSecondary, marginLeft: '10px' }}>
              (ID: {election.electionId})
            </span>
          </div>
          {isAlreadyRegistered && (
            <span style={{
              ...styles.statusBadge,
              background: '#10b981',
              color: 'white',
              fontSize: '12px',
              padding: '6px 12px'
            }}>
              ✅ Registered
            </span>
          )}
        </div>
        
        <div style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '8px' }}>
          📝 Registration: {new Date(election.regStart * 1000).toLocaleString()} - {new Date(election.regEnd * 1000).toLocaleString()}
        </div>
        
        <div style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '12px' }}>
          🗳️ Voting: {new Date(election.electionStart * 1000).toLocaleString()} - {new Date(election.electionEnd * 1000).toLocaleString()}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '14px' }}>
            Status: {regOpen ? 
              <span style={{ color: '#10b981', fontWeight: '600' }}>🟢 Registration Open</span> : 
              <span style={{ color: '#6b7280', fontWeight: '600' }}>🔴 Registration Closed</span>
            }
          </div>
          
          {regOpen && !isAlreadyRegistered && !checkingStatus && (
            <button
              onClick={handleRegisterForElection}
              disabled={isRegistering}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: isRegistering ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                opacity: isRegistering ? 0.5 : 1,
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!isRegistering) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(16, 185, 129, 0.3)';
              }}
            >
              {isRegistering ? '⏳ Registering...' : '📝 Register as Candidate'}
            </button>
          )}

          {checkingStatus && (
            <span style={{ fontSize: '14px', color: colors.textSecondary }}>
              ⏳ Checking status...
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderRegisterTab = () => {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📝 Register as Candidate</h2>
        
        {!profile?.email ? (
          <p style={{ color: colors.textSecondary }}>User profile not loaded</p>
        ) : elections.length === 0 ? (
          <p style={{ color: colors.textSecondary }}>No elections available</p>
        ) : (
          <div>
            <p style={{ color: colors.textSecondary, marginBottom: '20px', fontSize: '15px' }}>
              Register as a candidate for any election that is currently accepting registrations. You can only register during the registration period.
            </p>
            
            <div>
              {elections.map((election) => (
                <ElectionRegistrationCard key={election.electionId} election={election} />
              ))}
            </div>
          </div>
        )}

        {candidates.length > 0 && userElection && (
          <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: `2px solid ${colors.border}` }}>
            <h3 style={{ ...styles.cardTitle, fontSize: '1.3rem', marginBottom: '20px' }}>
              Candidates for {userElection.position} ({candidates.length})
            </h3>
            <div style={styles.candidateList}>
              {candidates.map((candidate, index) => (
                <div 
                  key={index} 
                  style={{
                    ...styles.candidateItem,
                    background: candidate === profile?.email ? 
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)' : 
                      colors.surfaceGlass,
                    border: candidate === profile?.email ? 
                      `2px solid #10b981` : 
                      `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{candidate}</span>
                    {candidate === profile?.email && (
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        background: '#10b981',
                        color: 'white',
                        borderRadius: '12px',
                        fontWeight: '600'
                      }}>
                        You
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const VotingCard = ({ election }) => {
    const [electionCandidates, setElectionCandidates] = useState([]);
    const [loadingCandidates, setLoadingCandidates] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [voting, setVoting] = useState(false);
    const [alreadyVoted, setAlreadyVoted] = useState(false);

    useEffect(() => {
      const loadElectionCandidates = async () => {
        try {
          const candidateList = await getCandidates(election.electionId);
          setElectionCandidates(candidateList);
          
          // Check if user has already voted for this election (from localStorage)
          if (profile?.email) {
            const voted = hasVotedForElection(profile.email, election.electionId);
            setAlreadyVoted(voted);
          }
        } catch (error) {
          console.error('Error loading candidates:', error);
        } finally {
          setLoadingCandidates(false);
        }
      };
      
      loadElectionCandidates();
    }, [election.electionId, profile]);

    const handleVoteSubmit = async (e) => {
      e.preventDefault();

      if (!selectedCandidate || !profile) {
        alert('Please select a candidate');
        return;
      }

      // Check localStorage before voting
      if (hasVotedForElection(profile.email, election.electionId)) {
        alert('You have already voted in this election!');
        return;
      }

      setVoting(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/voter/castVote`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              electionId: election.electionId,
              candidateEmail: selectedCandidate,
              email: profile.email
            })
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Mark as voted in localStorage
            markAsVoted(profile.email, election.electionId);
            setAlreadyVoted(true);
            
            // Verify vote count on blockchain
            const voteCount = await getCandidateVotes(election.electionId, selectedCandidate);
            console.log(`Vote recorded! Total votes for ${selectedCandidate}:`, voteCount);
            
            alert(`Vote cast successfully! ${selectedCandidate} now has ${voteCount} vote(s).`);
            setSelectedCandidate('');
          } else {
            alert(`Vote failed: ${data.error || 'Unknown error'}`);
          }
        } else {
          const error = await response.json();
          alert(`Vote failed: ${error.error || error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error casting vote:', error);
        alert('Error casting vote');
      } finally {
        setVoting(false);
      }
    };

    if (loadingCandidates) {
      return (
        <div style={{ 
          ...styles.candidateItem, 
          marginBottom: '15px',
          padding: '20px'
        }}>
          <p style={{ color: colors.textSecondary }}>⏳ Loading candidates...</p>
        </div>
      );
    }

    return (
      <div 
        style={{ 
          ...styles.candidateItem, 
          marginBottom: '15px',
          border: `2px solid #10b981`,
          padding: '20px'
        }}
      >
        <div style={{ marginBottom: '15px' }}>
          <strong style={{ fontSize: '18px', color: colors.text }}>{election.position}</strong>
          <span style={{ fontSize: '14px', color: colors.textSecondary, marginLeft: '10px' }}>
            (ID: {election.electionId})
          </span>
        </div>
        
        <div style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '12px' }}>
          🗳️ Voting: {new Date(election.electionStart * 1000).toLocaleString()} - {new Date(election.electionEnd * 1000).toLocaleString()}
        </div>

        {alreadyVoted ? (
          <p style={{ color: '#10b981', fontWeight: '600', marginTop: '15px' }}>
            ✅ You have already voted in this election!
          </p>
        ) : electionCandidates.length === 0 ? (
          <p style={{ color: colors.textSecondary, marginTop: '15px' }}>
            No candidates registered yet
          </p>
        ) : (
          <form onSubmit={handleVoteSubmit} style={{ marginTop: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ ...styles.label, display: 'block', marginBottom: '8px' }}>
                Select Candidate
              </label>
              <select
                value={selectedCandidate}
                onChange={(e) => setSelectedCandidate(e.target.value)}
                style={styles.select}
                required
              >
                <option value="">-- Choose a candidate --</option>
                {electionCandidates.map((candidate, index) => (
                  <option key={index} value={candidate}>
                    {candidate}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={voting}
              style={{
                padding: '12px 24px',
                background: voting 
                  ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: voting ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                opacity: voting ? 0.5 : 1,
                boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!voting) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(102, 126, 234, 0.3)';
              }}
            >
              {voting ? '⏳ Casting Vote...' : '✅ Cast Vote'}
            </button>
          </form>
        )}
      </div>
    );
  };

  const renderVoteTab = () => {
    const openVotingElections = elections.filter(election => {
      const now = Math.floor(Date.now() / 1000);
      return now >= election.electionStart && now <= election.electionEnd;
    });

    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🗳️ Cast Your Vote</h2>
        
        {openVotingElections.length === 0 ? (
          <p style={{ color: colors.textSecondary }}>No elections are currently open for voting</p>
        ) : (
          <div>
            <p style={{ color: colors.textSecondary, marginBottom: '20px', fontSize: '15px' }}>
              Vote for your preferred candidate in any open election. You can only vote once per election.
            </p>
            
            {openVotingElections.map((election) => (
              <VotingCard key={election.electionId} election={election} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const ElectionResultCard = ({ election }) => {
    const [results, setResults] = useState([]);
    const [loadingResults, setLoadingResults] = useState(true);
    const [totalVotes, setTotalVotes] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
      const loadResults = async () => {
        try {
          console.log(`Loading results for election ${election.electionId}: ${election.position}`);
          
          const candidateList = await getCandidates(election.electionId);
          console.log(`Candidates found:`, candidateList);
          
          if (candidateList.length === 0) {
            console.log('No candidates found for this election');
            setResults([]);
            setLoadingResults(false);
            return;
          }
          
          const resultsWithVotes = await Promise.all(
            candidateList.map(async (candidateEmail) => {
              try {
                console.log(`Fetching votes for candidate: ${candidateEmail}`);
                const votes = await getCandidateVotes(election.electionId, candidateEmail);
                console.log(`Votes for ${candidateEmail}:`, votes);
                
                return {
                  email: candidateEmail,
                  votes: Number(votes) || 0
                };
              } catch (error) {
                console.error(`Error getting votes for ${candidateEmail}:`, error);
                return {
                  email: candidateEmail,
                  votes: 0
                };
              }
            })
          );

          console.log('Results with votes:', resultsWithVotes);

          // Sort by votes descending
          resultsWithVotes.sort((a, b) => b.votes - a.votes);
          
          const total = resultsWithVotes.reduce((sum, r) => sum + r.votes, 0);
          console.log(`Total votes: ${total}`);
          
          setTotalVotes(total);
          setResults(resultsWithVotes);
        } catch (error) {
          console.error('Error loading results:', error);
          setError(error.message);
        } finally {
          setLoadingResults(false);
        }
      };

      loadResults();
    }, [election.electionId]);

    if (loadingResults) {
      return (
        <div style={styles.resultCard}>
          <h3 style={{ color: colors.text, fontSize: '18px', marginBottom: '10px' }}>
            {election.position} <span style={{ fontSize: '14px', color: colors.textSecondary }}>(ID: {election.electionId})</span>
          </h3>
          <p style={{ color: colors.textSecondary }}>⏳ Loading results...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={styles.resultCard}>
          <h3 style={{ color: colors.text, fontSize: '18px', marginBottom: '10px' }}>
            {election.position}
          </h3>
          <p style={{ color: '#ef4444' }}>❌ Error loading results: {error}</p>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div style={styles.resultCard}>
          <h3 style={{ color: colors.text, fontSize: '18px', marginBottom: '10px' }}>
            {election.position} <span style={{ fontSize: '14px', color: colors.textSecondary }}>(ID: {election.electionId})</span>
          </h3>
          <p style={{ color: colors.textSecondary }}>No candidates registered for this election</p>
        </div>
      );
    }

    const winner = results[0];
    const hasVotes = totalVotes > 0;

    return (
      <div style={styles.resultCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ color: colors.text, fontSize: '18px', margin: 0 }}>
            {election.position} <span style={{ fontSize: '14px', color: colors.textSecondary }}>(ID: {election.electionId})</span>
          </h3>
          <span style={{ fontSize: '14px', color: colors.textSecondary, fontWeight: '600' }}>
            Total Votes: {totalVotes}
          </span>
        </div>

        {!hasVotes && (
          <p style={{ color: colors.textSecondary, marginBottom: '20px', fontSize: '14px' }}>
            No votes have been cast yet
          </p>
        )}

        <div style={{ marginTop: '20px' }}>
          {results.map((result, index) => {
            const percentage = totalVotes > 0 ? ((result.votes / totalVotes) * 100).toFixed(1) : 0;
            const isWinner = index === 0 && result.votes > 0 && totalVotes > 0;

            return (
              <div key={result.email} style={{ marginBottom: '20px' }}>
                <div style={styles.resultRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    {isWinner && <span>🏆</span>}
                    <span style={{ 
                      color: colors.text, 
                      fontWeight: isWinner ? '700' : '600',
                      fontSize: '15px' 
                    }}>
                      {result.email}
                    </span>
                    {isWinner && (
                      <span style={{
                        fontSize: '11px',
                        padding: '4px 8px',
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        color: 'white',
                        borderRadius: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}>
                        Winner
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={styles.voteCount}>{result.votes}</span>
                    <span style={{ 
                      color: colors.textSecondary, 
                      fontSize: '14px',
                      fontWeight: '600',
                      minWidth: '50px',
                      textAlign: 'right'
                    }}>
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${percentage}%`,
                      background: isWinner 
                        ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                        : 'linear-gradient(135deg, #10b981, #059669)'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderResultsTab = () => {
    const completedElections = elections.filter(election => {
      const now = Math.floor(Date.now() / 1000);
      return now > election.electionEnd;
    });

    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🏆 Election Results</h2>
        
        {completedElections.length === 0 ? (
          <p style={{ color: colors.textSecondary }}>No completed elections yet</p>
        ) : (
          <div>
            <p style={{ color: colors.textSecondary, marginBottom: '20px', fontSize: '15px' }}>
              View results for completed elections. Winners are highlighted with 🏆.
            </p>
            
            {completedElections.map((election) => (
              <ElectionResultCard key={election.electionId} election={election} />
            ))}
          </div>
        )}
      </div>
    );
  };

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

      <div style={styles.tabContainer}>
        {['profile', 'elections', 'register', 'vote', 'results'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : styles.inactiveTab),
            }}
          >
            {tab === 'profile' && '👤 Profile'}
            {tab === 'elections' && '📊 Elections'}
            {tab === 'register' && '📝 Register'}
            {tab === 'vote' && '🗳️ Vote'}
            {tab === 'results' && '🏆 Results'}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'elections' && renderElectionsTab()}
        {activeTab === 'register' && renderRegisterTab()}
        {activeTab === 'vote' && renderVoteTab()}
        {activeTab === 'results' && renderResultsTab()}
      </div>

      <button
        onClick={() => setShowChatbot(!showChatbot)}
        style={styles.chatbotToggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = `scale(1.1) rotate(${showChatbot ? '90deg' : '0deg'})`;
          e.currentTarget.style.boxShadow = showChatbot
            ? '0 6px 20px rgba(239, 68, 68, 0.6)'
            : '0 6px 20px rgba(102, 126, 234, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = `scale(1) rotate(${showChatbot ? '90deg' : '0deg'})`;
          e.currentTarget.style.boxShadow = showChatbot
            ? '0 4px 15px rgba(239, 68, 68, 0.4)'
            : '0 4px 15px rgba(102, 126, 234, 0.4)';
        }}
        title={showChatbot ? 'Close chat' : 'Chat with us'}
      >
        {showChatbot ? '✕' : '💬'}
      </button>

      {showChatbot && (
        <Chatbot onClose={() => setShowChatbot(false)} />
      )}
    </div>
  );
}

export default VoterDashboard;