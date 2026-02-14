import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Modal from '../components/Modal';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input change
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // TODO: Connect to blockchain backend API
    // Example API call:
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(loginData)
    // });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation (replace with actual backend call)
      if (loginData.email && loginData.password) {
        // Store token/session (example)
        // localStorage.setItem('authToken', response.token);
        // localStorage.setItem('userRole', response.role);
        
        // Demo: Navigate based on email pattern
        if (loginData.email.includes('admin')) {
          navigate('/admin/dashboard');
        } else {
          navigate('/voter/dashboard');
        }
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Connect to blockchain backend API
    // Example API call:
    // await fetch('/api/auth/reset-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: resetEmail })
    // });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Password reset instructions have been sent to ${resetEmail}`);
      setIsResetModalOpen(false);
      setResetEmail('');
    } catch (err) {
      alert('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16">
        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>📧 Credentials provided by blockchain backend</strong>
              <br />
              Your email and password are securely generated and sent to your registered email address.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />

            <div className="relative">
              <FormInput
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 font-semibold mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Admin:</strong> admin@example.com / password</div>
              <div><strong>Voter:</strong> voter@example.com / password</div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have credentials?{' '}
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Contact Administrator
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Password Reset Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Password"
        footer={
          <div className="flex justify-end gap-2">
            <Button 
              variant="secondary" 
              onClick={() => setIsResetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePasswordReset}
              disabled={!resetEmail || loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        }
      >
        <div>
          <p className="text-gray-700 mb-4">
            Enter your registered email address and we'll send you instructions to reset your password.
          </p>
          
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The reset link will be sent to your email address registered with the blockchain backend system.
            </p>
          </div>

          <FormInput
            label="Email Address"
            type="email"
            name="resetEmail"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
          />

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              ⚠️ For security reasons, password reset requires blockchain verification. 
              You will receive a secure reset link via email.
            </p>
          </div>
        </div>
      </Modal>

      {/* TODO: Connect to blockchain backend API for authentication */}
      {/* API Endpoints needed:
          POST /api/auth/login - User login
          POST /api/auth/reset-password - Password reset request
          POST /api/auth/verify-reset-token - Verify reset token
          POST /api/auth/update-password - Update password
      */}
    </div>
  );
};

export default Login;
