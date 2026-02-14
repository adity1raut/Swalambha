import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function VoterLogin() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    voterId: '',
    electionId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, user, userType } = useAuth();

  useEffect(() => {
    // Redirect if already logged in
    if (user && userType === 'voter') {
      navigate('/voter/dashboard', { replace: true });
    }
  }, [user, userType, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isRegisterMode ? '/register' : '/login';
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/voter${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(isRegisterMode ? formData : {
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegisterMode) {
          setSuccess('Registration successful! You can now login.');
          setFormData({ name: '', email: '', password: '', voterId: '', electionId: '' });
          setTimeout(() => {
            setIsRegisterMode(false);
            setSuccess('');
          }, 2000);
        } else {
          login(data.token, data.voter, 'voter');
          navigate('/voter/dashboard');
        }
      } else {
        setError(data.message || `${isRegisterMode ? 'Registration' : 'Login'} failed`);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setFormData({ name: '', email: '', password: '', voterId: '', electionId: '' });
    setError('');
    setSuccess('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>
          {isRegisterMode ? 'Voter Registration' : 'Voter Login'}
        </h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegisterMode && (
            <div style={styles.inputGroup}>
              <label htmlFor="name" style={styles.label}>Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          {isRegisterMode && (
            <>
              <div style={styles.inputGroup}>
                <label htmlFor="voterId" style={styles.label}>Voter ID</label>
                <input
                  type="text"
                  id="voterId"
                  name="voterId"
                  value={formData.voterId}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Enter your voter ID"
                />
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="electionId" style={styles.label}>Election ID</label>
                <input
                  type="text"
                  id="electionId"
                  name="electionId"
                  value={formData.electionId}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Enter election ID"
                />
              </div>
            </>
          )}

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? (isRegisterMode ? 'Registering...' : 'Logging in...') : (isRegisterMode ? 'Register' : 'Login')}
          </button>

          <button
            type="button"
            onClick={toggleMode}
            style={styles.toggleButton}
          >
            {isRegisterMode ? 'Already have an account? Login' : 'New voter? Register'}
          </button>

          <Link to="/login" style={styles.adminLink}>
            Login as Admin
          </Link>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  formWrapper: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
    fontSize: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#555'
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s'
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed'
  },
  toggleButton: {
    padding: '10px',
    fontSize: '14px',
    backgroundColor: 'transparent',
    color: '#28a745',
    border: '1px solid #28a745',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  adminLink: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#007bff',
    textDecoration: 'none',
    marginTop: '10px'
  },
  error: {
    padding: '10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'center'
  },
  success: {
    padding: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'center'
  }
};

export default VoterLogin;