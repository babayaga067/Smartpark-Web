import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import Navbar from '../components/Navbar.jsx';

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
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (isAdmin) {
      // Demo admin credentials
      if (form.email === 'admin@smartpark.com' && form.password === 'admin123') {
        navigate('/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      // Check user credentials from localStorage
      const user = JSON.parse(localStorage.getItem('smartpark_user'));
      if (
        user &&
        form.email === user.email &&
        form.password === user.password
      ) {
        navigate('/dashboard');
      } else {
        setError('Invalid user credentials');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-box fade-in">
          <h2>{isAdmin ? 'Admin Login' : 'User Login'}</h2>
          <p>
            {isAdmin
              ? 'Enter your credentials to access the admin dashboard'
              : 'Sign in to your user account to manage parking'}
          </p>
          {error && (
            <div style={{ color: 'red', marginBottom: '1rem', fontSize: '1rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder={isAdmin ? 'admin@smartpark.com' : 'user@example.com'}
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
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
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary">
              {isAdmin ? 'Sign in as Admin' : 'Sign in as User'}
            </button>
          </form>

          <div className="action-buttons">
            <button onClick={toggleUserType} className="switch-btn">
              {isAdmin ? 'Switch to User Login' : 'Switch to Admin Login'}
            </button>
            <button
              className="register-btn"
              onClick={() => navigate('/register')}
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;