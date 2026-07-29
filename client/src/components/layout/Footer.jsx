import React from 'react';
import '../../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer glass-panel">
      <p>&copy; {new Date().getFullYear()} Business Analytics. All rights reserved.</p>
      <div className="footer-links">
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#support">Support</a>
      </div>
    </footer>
  );
}
