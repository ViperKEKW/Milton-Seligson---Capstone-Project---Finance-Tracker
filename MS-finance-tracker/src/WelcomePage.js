import React from 'react';
import './WelcomePage.css';
import { Link } from 'react-router-dom';
import './WelcomePage.css'; // Importing custom styles (optional)

function WelcomePage() {
    return (
      <div className="welcome-container">
        <h1>Welcome to the Finance Tracker</h1>
        
        {/* Detailed Welcome Message */}
        <p className="welcome-message">
          We are excited to have you here! Our Finance Tracker platform is designed to help you 
          take control of your financial future. Whether you're managing day-to-day expenses, 
          tracking investments, or planning for long-term financial goals, we’ve got you covered.
        </p>
  
        {/* Mission Statement Section */}
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            At Finance Tracker, our mission is to empower individuals to make informed financial 
            decisions through clear, user-friendly tools. We aim to provide you with insights into 
            your spending habits, help you manage your investments, and create a roadmap for financial success.
            We believe that financial literacy is the key to achieving financial independence, and we are 
            committed to making that accessible to everyone.
          </p>
        </section>
  
        {/* Call to Action - Login or Create Account */}
        <div className="button-group">
          <Link to="/login">
            <button className="welcome-button">Login</button>
          </Link>
          <Link to="/create-account">
            <button className="welcome-button">Create Account</button>
          </Link>
        </div>
      </div>
    );
  }
  
  export default WelcomePage;
