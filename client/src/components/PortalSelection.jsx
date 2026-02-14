import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function PortalSelection() {
  const navigate = useNavigate();
  const { theme, toggleTheme, colors } = useTheme();

  const portals = [
    {
      id: 'voter',
      title: 'Voter Portal',
      icon: '🗳️',
      description: 'Cast your vote securely and track your voting status.',
      features: ['Secure Voting', 'Real-time Results'],
      color: colors.primary,
      path: '/voter/login'
    },
    {
      id: 'admin',
      title: 'Admin Portal',
      icon: '⚙️',
      description: 'Manage elections, configure settings, and monitor system performance.',
      features: ['Admin Controls', 'System Analytics'],
      color: colors.secondary,
      path: '/login'
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: colors.gradient,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
    },
    themeToggle: {
      position: 'fixed',
      top: '30px',
      right: '30px',
      padding: '12px 24px',
      background: colors.surfaceGlass,
      border: `2px solid ${colors.border}`,
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      zIndex: 100,
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: colors.text,
    },
    backButton: {
      position: 'fixed',
      top: '30px',
      left: '30px',
      padding: '12px 24px',
      background: colors.surfaceGlass,
      border: `2px solid ${colors.border}`,
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      zIndex: 100,
      backdropFilter: 'blur(10px)',
      fontSize: '16px',
      fontWeight: '600',
      color: colors.text,
    },
    header: {
      textAlign: 'center',
      marginBottom: '60px',
      maxWidth: '800px',
    },
    title: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: '900',
      color: colors.text,
      marginBottom: '15px',
    },
    subtitle: {
      fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
      color: colors.textSecondary,
      lineHeight: '1.6',
    },
    portalsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 450px))',
      gap: '40px',
      maxWidth: '1200px',
      width: '100%',
      justifyContent: 'center',
    },
    portalCard: {
      background: colors.surfaceGlass,
      borderRadius: '24px',
      padding: '45px 35px',
      border: `1px solid ${colors.border}`,
      backdropFilter: 'blur(20px)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    iconWrapper: {
      width: '100px',
      height: '100px',
      margin: '0 auto 25px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      transition: 'all 0.3s ease',
    },
    portalTitle: {
      fontSize: '1.75rem',
      fontWeight: '800',
      color: colors.text,
      marginBottom: '15px',
    },
    portalDescription: {
      fontSize: '1rem',
      color: colors.textSecondary,
      lineHeight: '1.6',
      marginBottom: '25px',
    },
    features: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '30px',
    },
    featureBadge: {
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      background: colors.cardGradient,
      border: `1px solid ${colors.border}`,
      color: colors.primary,
    },
    loginButton: {
      width: '100%',
      padding: '16px 32px',
      borderRadius: '50px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '700',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        style={styles.themeToggle}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {theme === 'dark' ? (
          <>
            <span style={{ fontSize: '18px' }}>☀️</span>
            <span>Light</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '18px' }}>🌙</span>
            <span>Dark</span>
          </>
        )}
      </button>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        style={styles.backButton}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        ← Home
      </button>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          Select your portal to access your personalized dashboard and resources
        </h1>
        <p style={styles.subtitle}>
          Choose the appropriate portal to continue
        </p>
      </div>

      {/* Portals Grid */}
      <div style={styles.portalsGrid}>
        {portals.map((portal) => (
          <div
            key={portal.id}
            style={styles.portalCard}
            onClick={() => navigate(portal.path)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
              e.currentTarget.style.boxShadow = `0 25px 50px ${portal.color}30`;
              e.currentTarget.style.borderColor = portal.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = colors.border;
            }}
          >
            <div
              style={{
                ...styles.iconWrapper,
                background: `linear-gradient(135deg, ${portal.color}20, ${portal.color}10)`,
                border: `2px solid ${portal.color}40`,
              }}
            >
              {portal.icon}
            </div>
            
            <h2 style={styles.portalTitle}>{portal.title}</h2>
            
            <p style={styles.portalDescription}>{portal.description}</p>
            
            <div style={styles.features}>
              {portal.features.map((feature, idx) => (
                <span key={idx} style={styles.featureBadge}>
                  ✓ {feature}
                </span>
              ))}
            </div>
            
            <button
              style={{
                ...styles.loginButton,
                background: `linear-gradient(135deg, ${portal.color}, ${portal.color}dd)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${portal.color}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>Login Now</span>
              <span style={{ fontSize: '18px' }}>→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortalSelection;
