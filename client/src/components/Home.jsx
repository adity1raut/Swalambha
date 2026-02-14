import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme, colors } = useTheme();

  const features = [
    {
      icon: '👨‍💼',
      title: 'Admin Dashboard',
      description: 'Upload voter lists via CSV/Excel, create elections, and manage the entire voting process from one centralized dashboard'
    },
    {
      icon: '🗳️',
      title: 'Secure Voting',
      description: 'Voters receive unique credentials via email and cast their votes securely with end-to-end encryption'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track voter participation and view live election results with comprehensive visual analytics'
    },
    {
      icon: '📧',
      title: 'Automated Notifications',
      description: 'Automatic email delivery of voter credentials and election updates to all participants'
    },
    {
      icon: '🔒',
      title: 'Role-Based Access',
      description: 'Separate portals for administrators and voters with secure authentication and authorization'
    },
    {
      icon: '📱',
      title: 'Fully Responsive',
      description: 'Access the platform seamlessly from any device - desktop, tablet, or mobile'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Admin Creates Election',
      description: 'Admin uploads voter database (CSV/Excel) with names and emails',
      icon: '📋'
    },
    {
      step: '2',
      title: 'System Sends Credentials',
      description: 'Each voter receives unique login credentials via email automatically',
      icon: '✉️'
    },
    {
      step: '3',
      title: 'Voters Cast Ballots',
      description: 'Voters log in securely and submit their votes during the election period',
      icon: '✅'
    },
    {
      step: '4',
      title: 'Results Published',
      description: 'Real-time results and analytics displayed on the admin dashboard',
      icon: '📈'
    }
  ];

  const stats = [
    { value: '256-bit', label: 'Encryption' },
    { value: '99.9%', label: 'Uptime' },
    { value: '2 Roles', label: 'Admin & Voter' },
    { value: '100%', label: 'Transparent' }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
      color: colors.text,
      transition: 'background 0.3s ease, color 0.3s ease',
    },
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backdropFilter: 'blur(10px)',
      background: colors.navbarBg,
      boxShadow: `0 2px 10px ${colors.shadowColor}`,
      borderBottom: `1px solid ${colors.border}`,
      zIndex: 1000,
    },
    logo: {
      fontSize: '26px',
      fontWeight: '800',
      color: colors.text,
      letterSpacing: '-0.5px',
    },
    navButtons: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
    },
    themeToggle: {
      padding: '10px 20px',
      background: colors.surface,
      border: `2px solid ${colors.border}`,
      borderRadius: '25px',
      color: colors.text,
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    loginBtn: {
      padding: '12px 32px',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      border: 'none',
      borderRadius: '25px',
      color: '#FFFFFF',
      fontWeight: '700',
      cursor: 'pointer',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      boxShadow: `0 4px 12px ${colors.shadowColor}`,
    },
    hero: {
      paddingTop: '140px',
      paddingBottom: '60px',
      textAlign: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '140px 20px 60px',
    },
    heroTitle: {
      fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
      fontWeight: '900',
      marginBottom: '24px',
      color: colors.text,
      lineHeight: '1.1',
      letterSpacing: '-1px',
    },
    heroSubtitle: {
      fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
      color: colors.textSecondary,
      marginBottom: '40px',
      maxWidth: '800px',
      margin: '0 auto 40px',
      lineHeight: '1.6',
      fontWeight: '400',
    },
    ctaButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '40px',
    },
    primaryBtn: {
      padding: '18px 48px',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      border: 'none',
      borderRadius: '30px',
      color: '#FFFFFF',
      fontSize: '17px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: `0 6px 20px ${colors.shadowColor}`,
    },
    secondaryBtn: {
      padding: '18px 48px',
      background: 'transparent',
      border: `2px solid ${colors.primary}`,
      borderRadius: '30px',
      color: colors.primary,
      fontSize: '17px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    statsSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '30px',
      maxWidth: '1100px',
      margin: '60px auto',
      padding: '0 20px',
    },
    statCard: {
      textAlign: 'center',
      padding: '35px 20px',
      background: colors.cardBg,
      borderRadius: '20px',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
      boxShadow: `0 2px 8px ${colors.shadowColor}`,
    },
    statValue: {
      fontSize: '2.8rem',
      fontWeight: '900',
      color: colors.primary,
      marginBottom: '8px',
    },
    statLabel: {
      fontSize: '1rem',
      color: colors.textSecondary,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    section: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '80px 20px',
    },
    sectionTitle: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: '20px',
      color: colors.text,
      letterSpacing: '-0.5px',
    },
    sectionSubtitle: {
      fontSize: '1.2rem',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: '60px',
      lineHeight: '1.6',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '30px',
    },
    featureCard: {
      padding: '40px 30px',
      background: colors.cardBg,
      borderRadius: '20px',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
      boxShadow: `0 2px 8px ${colors.shadowColor}`,
    },
    featureIcon: {
      fontSize: '3.5rem',
      marginBottom: '20px',
      display: 'block',
    },
    featureTitle: {
      fontSize: '1.4rem',
      fontWeight: '700',
      marginBottom: '12px',
      color: colors.text,
    },
    featureDesc: {
      fontSize: '1rem',
      color: colors.textSecondary,
      lineHeight: '1.7',
    },
    stepNumber: {
      fontSize: '3rem',
      fontWeight: '900',
      color: colors.primary,
      marginBottom: '15px',
    },
    roleCard: {
      padding: '45px 35px',
      background: colors.cardBg,
      borderRadius: '25px',
      border: `2px solid ${colors.border}`,
      transition: 'all 0.3s ease',
      boxShadow: `0 4px 15px ${colors.shadowColor}`,
    },
    roleIcon: {
      fontSize: '4rem',
      marginBottom: '20px',
      display: 'block',
    },
    roleTitle: {
      fontSize: '2rem',
      fontWeight: '800',
      marginBottom: '12px',
      color: colors.text,
    },
    roleDesc: {
      fontSize: '1.1rem',
      color: colors.textSecondary,
      marginBottom: '30px',
      lineHeight: '1.6',
    },
    roleFeatures: {
      textAlign: 'left',
      color: colors.textSecondary,
      lineHeight: '2.2',
      fontSize: '1rem',
    },
    footer: {
      textAlign: 'center',
      padding: '50px 20px',
      background: colors.surface,
      borderTop: `1px solid ${colors.border}`,
      color: colors.textSecondary,
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>E-Voting System</div>
        <div style={styles.navButtons}>
          <button
            onClick={toggleTheme}
            style={styles.themeToggle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = colors.border;
            }}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            onClick={() => navigate('/portals')}
            style={styles.loginBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${colors.shadowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${colors.shadowColor}`;
            }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Election Management System</h1>
        <p style={styles.heroSubtitle}>
          A comprehensive digital platform for conducting secure, transparent elections. Upload voter lists, manage elections, and let voters cast their ballots - all in one place.
        </p>
        <div style={styles.ctaButtons}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate('/portals')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 10px 30px ${colors.shadowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 6px 20px ${colors.shadowColor}`;
            }}
          >
            Get Started
          </button>
          <button
            style={styles.secondaryBtn}
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary;
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = `0 8px 20px ${colors.shadowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadowColor}`;
            }}
          >
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <p style={styles.sectionSubtitle}>
          Simple, secure, and streamlined election process in 4 easy steps
        </p>
        <div style={styles.featuresGrid}>
          {howItWorks.map((item, index) => (
            <div
              key={index}
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.boxShadow = `0 10px 30px ${colors.shadowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadowColor}`;
              }}
            >
              <div style={styles.stepNumber}>{item.step}</div>
              <div style={styles.featureIcon}>{item.icon}</div>
              <div style={styles.featureTitle}>{item.title}</div>
              <div style={styles.featureDesc}>{item.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Roles Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Two User Roles</h2>
        <p style={styles.sectionSubtitle}>
          Our system is designed with two distinct roles to streamline the entire election process
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
          <div
            style={styles.roleCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.boxShadow = `0 12px 35px ${colors.shadowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.boxShadow = `0 4px 15px ${colors.shadowColor}`;
            }}
          >
            <div style={styles.roleIcon}>👨‍💼</div>
            <div style={styles.roleTitle}>Admin</div>
            <div style={styles.roleDesc}>
              Full control over election management and voter database
            </div>
            <div style={styles.roleFeatures}>
              ✅ Upload voter lists (CSV/Excel)<br />
              ✅ Create and manage elections<br />
              ✅ Send automated credentials<br />
              ✅ View real-time analytics<br />
              ✅ Monitor voter participation
            </div>
          </div>

          <div
            style={styles.roleCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.borderColor = colors.secondary;
              e.currentTarget.style.boxShadow = `0 12px 35px ${colors.shadowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.boxShadow = `0 4px 15px ${colors.shadowColor}`;
            }}
          >
            <div style={styles.roleIcon}>🗳️</div>
            <div style={styles.roleTitle}>Voter</div>
            <div style={styles.roleDesc}>
              Secure access to cast votes in authorized elections
            </div>
            <div style={styles.roleFeatures}>
              ✅ Receive login credentials via email<br />
              ✅ Access voter portal securely<br />
              ✅ View available elections<br />
              ✅ Cast votes anonymously<br />
              ✅ Get confirmation receipts
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Powerful Features</h2>
        <p style={styles.sectionSubtitle}>
          Everything you need to conduct secure and transparent elections
        </p>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.boxShadow = `0 10px 30px ${colors.shadowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadowColor}`;
              }}
            >
              <div style={styles.featureIcon}>{feature.icon}</div>
              <div style={styles.featureTitle}>{feature.title}</div>
              <div style={styles.featureDesc}>{feature.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={{ fontSize: '1rem', marginBottom: '10px' }}>
          © 2026 E-Voting System. All rights reserved.
        </p>
        <p style={{ fontSize: '0.95rem' }}>
          Secure • Transparent • Reliable
        </p>
      </footer>
    </div>
  );
}

export default Home;