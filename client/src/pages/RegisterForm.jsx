import React, { useState } from 'react';
import axios from 'axios';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // State for success message
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  axios.defaults.baseURL = `http://localhost:5270`;

  const checkPasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    if (!lengthCriteria) return 'Weak';
    if (
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      password.length >= 10
    )
      return 'Strong';
    if ((hasUpperCase || hasLowerCase) && hasNumber) return 'Medium';
    return 'Weak';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success message

    if (!executeRecaptcha) {
      setError('reCAPTCHA not ready');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (passwordStrength === 'Weak') {
      setError('Password is too weak. Please choose a stronger password.');
      return;
    }

    if (passwordStrength === 'Medium') {
      const confirmMediumStrength = window.confirm(
        'Your password is of medium strength. Do you still want to proceed?'
      );
      if (!confirmMediumStrength) {
        return;
      }
    }

    const recaptchaToken = await executeRecaptcha('register');

    try {
      const response = await axios.post('/api/auth/register', {
        userName,
        password,
        recaptchaToken,
      });

      // If registration is successful, set success message
      setSuccess('Registration successful!');
      console.log('Registration success:', response.data);
    } catch (error) {
      if (error.response) {
        // Check if it's a conflict error (409)
        if (error.response.status === 409) {
          setError(error.response.data.message || 'Username already exists');
        } else {
          setError('Registration failed');
        }
      } else {
        setError('Registration failed: ' + error.message);
      }
      console.error('Error:', error);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'Weak':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='max-w-md w-full bg-white p-8 rounded-lg shadow-md'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>
              User Name:
            </label>
            <input
              type='text'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
            />
          </div>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>
              Password:
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                required
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
              />
              <span
                className='absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <p
              className={`text-sm mt-2 ${
                passwordStrength === 'Weak'
                  ? 'text-red-500'
                  : passwordStrength === 'Medium'
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}
            >
              Password strength: {passwordStrength}
            </p>
            <div className='w-full bg-gray-200 h-2 rounded-full mt-2'>
              <div
                className={`${getPasswordStrengthColor()} h-2 rounded-full`}
                style={{
                  width:
                    passwordStrength === 'Weak'
                      ? '33%'
                      : passwordStrength === 'Medium'
                      ? '66%'
                      : '100%',
                }}
              ></div>
            </div>
          </div>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>
              Confirm Password:
            </label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
              />
              <span
                className='absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Success and Error messages */}
          {success && <p className='text-green-500 text-sm'>{success}</p>}
          {error && <p className='text-red-500 text-sm'>{error}</p>}

          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none'
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
