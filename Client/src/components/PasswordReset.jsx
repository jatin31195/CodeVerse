import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const PasswordReset = () => {
  // Use location to read query parameters from the URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token'); // token passed from the email link

  // Local state to handle form inputs and UI messages
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check that passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    try {
      // Call backend API to reset password
      const response = await fetch('http://localhost:8080/api/auth/reset-password'
      , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        setError('');
      } else {
        setError(data.message || 'Reset failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Reset Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="newPassword" style={{ display: 'block' }}>New Password:</label>
          <input 
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block' }}>Confirm New Password:</label>
          <input 
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Reset Password</button>
      </form>
    </div>
  );
};

export default PasswordReset;
