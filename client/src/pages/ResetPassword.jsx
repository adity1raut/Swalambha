import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    };
  };

  const passwordStrength = validatePassword(formData.newPassword);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (!passwordStrength.isValid) {
      setError('Password does not meet security requirements');
      return;
    }

    setLoading(true);

    // TODO: Connect to blockchain backend API
    // Example API call:
    // const response = await fetch('/api/auth/update-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     token: token,
    //     newPassword: formData.newPassword
    //   })
    // });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again or request a new reset link.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <Navbar />
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your password has been successfully updated.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Reset Your Password</h1>
            <p className="text-gray-600 mt-2">Create a new secure password</p>
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

          {/* Reset Form */}
          <form onSubmit={handleResetPassword}>
            {/* New Password */}
            <div className="relative">
              <FormInput
                label="New Password"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                <div className="space-y-1 text-xs">
                  <div className={`flex items-center ${passwordStrength.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordStrength.minLength ? '✓' : '○'} At least 8 characters
                  </div>
                  <div className={`flex items-center ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordStrength.hasUpperCase ? '✓' : '○'} One uppercase letter
                  </div>
                  <div className={`flex items-center ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordStrength.hasLowerCase ? '✓' : '○'} One lowercase letter
                  </div>
                  <div className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordStrength.hasNumber ? '✓' : '○'} One number
                  </div>
                  <div className={`flex items-center ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordStrength.hasSpecialChar ? '✓' : '○'} One special character
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <FormInput
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className={`mb-4 p-2 rounded-lg text-sm ${
                formData.newPassword === formData.confirmPassword 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {formData.newPassword === formData.confirmPassword 
                  ? '✓ Passwords match' 
                  : '✗ Passwords do not match'}
              </div>
            )}

            {/* Security Info */}
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                🔒 <strong>Blockchain Security:</strong> Your new password will be encrypted and securely stored 
                in the blockchain backend system.
              </p>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              disabled={loading || !passwordStrength.isValid || formData.newPassword !== formData.confirmPassword}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting Password...
                </span>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>

      {/* TODO: Connect to blockchain backend API */}
      {/* API Endpoints needed:
          POST /api/auth/verify-reset-token - Verify token validity
          POST /api/auth/update-password - Update password with blockchain verification
      */}
    </div>
  );
};

export default ResetPassword;
