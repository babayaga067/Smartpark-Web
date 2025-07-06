import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; // Your CSS path
import Navbar from '../components/Navbar.jsx';
import AuthService from '../../Services/AuthService.js'; // Your backend service

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleUserType = () => {
    setIsAdmin(!isAdmin);
    setShowPassword(false);
    setError('');
    setForm({ email: '', password: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (isAdmin) {
      // Admin login is hardcoded for now
      if (form.email === 'admin@smartpark.com' && form.password === 'admin123') {
        navigate('/dashboard'); // admin dashboard route
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      // User login via backend API
      try {
        const response = await AuthService.login(form);
        if (response.success) {
          // Redirect to user dashboard and pass user info
          navigate('/Dashboard', { state: { user: response.data.user } });
        } else {
          setError(response.message || 'Login failed');
        }
      } catch (err) {
        setError(err.message || 'Login failed');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-wrapper">
        <div className="login-box fade-in">
          <h2>{isAdmin ? 'Admin Login' : 'User Login'}</h2>
          <p>
            {isAdmin
              ? 'Enter your credentials to access the admin dashboard'
              : 'Sign in to your user account to manage parking'}
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={isAdmin ? 'admin@smartpark.com' : 'user@example.com'}
              value={form.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />

            <div className="options">
              <label>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
              </label>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-primary">
              {isAdmin ? 'Sign in as Admin' : 'Sign in as User'}
            </button>
          </form>

          <div className="action-buttons">
            <button onClick={toggleUserType} className="switch-btn">
              {isAdmin ? 'Switch to User Login' : 'Switch to Admin Login'}
            </button>
            <button className="register-btn" onClick={() => navigate('/register')}>
              Register Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
