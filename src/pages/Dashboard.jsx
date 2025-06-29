import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <motion.div
        className="homepage-hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="hero-content">
          <h1>
            Welcome to <span className="brand">SmartPark</span>
          </h1>
          <p>
            Effortless parking management for drivers and administrators.<br />
            Reserve, manage, and monitor parking spaces in real time.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn-secondary" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Smart Parking" />
        </div>
      </motion.div>

      <section className="features-section">
        <h2>Features</h2>
        <div className="features-list">
          <div className="feature-card">
            <span role="img" aria-label="search">🔍</span>
            <h3>Find Parking</h3>
            <p>Search and reserve available parking spots in advance.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="monitor">📊</span>
            <h3>Real-Time Monitoring</h3>
            <p>Track parking space availability and usage statistics.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="secure">🔒</span>
            <h3>Secure Access</h3>
            <p>Login as user or admin to access personalized dashboards.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="pay">💳</span>
            <h3>Easy Payments</h3>
            <p>Pay for your parking securely and instantly online.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>About SmartPark</h2>
        <p>
          SmartPark is a modern solution for urban parking challenges. Our platform connects drivers and parking lot owners, making parking hassle-free, efficient, and secure. Whether you are a daily commuter or a parking manager, SmartPark has the tools you need.
        </p>
      </section>

      <footer className="homepage-footer">
        <p>&copy; {new Date().getFullYear()} SmartPark. All rights reserved.</p>
      </footer>
    </>
  );
};

export default HomePage;