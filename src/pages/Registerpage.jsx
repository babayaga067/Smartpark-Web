import React, { useState } from 'react';
import '../styles/RegisterPage.css';
import Navbar from '../components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleRegister = (e) => {
    e.preventDefault();
    // Save user details to localStorage (for demo)
     localStorage.setItem('smartpark_user', JSON.stringify(form));
    // Handle registration logic here
    // For now, just navigate to the dashboard
    navigate('/Login');  
  };
   
  return (
    <>
       <Navbar />
      <div className="login-container">
        <div className="login-box fade-in">
          <h2>Create Account</h2>
          <p>Fill in the details to register for SmartPark</p>

          <form onSubmit={handleRegister}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Create a password"
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
            </div>

            <button type="submit" className="btn-primary">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;