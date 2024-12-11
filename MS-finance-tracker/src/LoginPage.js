import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './api'; // Adjust path if needed

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    if (!username || !password) {
      setMessage('Please enter both username and password');
      return;
    }

    try {
      // Use the login function from api.js, which will:
      // 1. Call the /users/login endpoint.
      // 2. Store the token in localStorage if successful.
      const result = await login(username, password);

      if (result && result.token) {
        setMessage('Login successful!');
        // Redirect to the dashboard after a brief delay
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        // If no token returned, treat it as an invalid login
        setMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '300px', margin: 'auto' }}>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
