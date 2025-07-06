import React, { useState } from 'react';
import '../styles/RegisterPage.css';
import Navbar from '../components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../Services/AuthService.js';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await AuthService.register({
        username: form.username,
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      if (response.success) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setError('');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-wrapper">
        <div className="register-box fade-in">
          <h2>Create Account</h2>
          <p>Fill in the details to register for SmartPark</p>

          <form onSubmit={handleRegister}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter a username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Your full name"
              value={form.fullName}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
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
            </div>

            {error && (
              <div style={{ color: 'red', fontSize: '0.9em', marginBottom: '10px' }}>
                {error}
              </div>
            )}

            {successMessage && (
              <div style={{ color: 'green', fontSize: '0.9em', marginBottom: '10px' }}>
                {successMessage}
              </div>
            )}

            <button type="submit" className="btn-primary">
              Register
            </button>
          </form>

          <div className="action-buttons">
            <button
              className="login-link-btn"
              onClick={() => navigate('/')}
            >
              Already have an account? Login here
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
