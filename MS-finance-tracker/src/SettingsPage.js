import React from 'react';
import Navbar from './Navbar'; // Import the Navbar component
import './SettingsPage.css'; // You can create a CSS file for the settings page if needed
import { fetchData, postData } from './api';


function SettingsPage() {
  return (
    <div className="settings-container">
      <Navbar /> {/* Add the Navbar here */}
      <h1>Settings</h1>
      <p>Update your account settings, preferences, and more.</p>
    </div>
  );
}

export default SettingsPage;
