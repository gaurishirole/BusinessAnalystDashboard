import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { TrendingUp } from 'lucide-react';
import '../../styles/Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-brand">
          <TrendingUp className="brand-icon" size={28} />
          <h2>Finance Analytics</h2>
        </div>

        {sent ? (
          <div className="auth-header">
            <h3>Check your email</h3>
            <p>We sent a reset link to {email}</p>
            <Link to="/login" className="back-to-login" style={{ display: 'inline-block', marginTop: '1rem' }}>Back to Sign In</Link>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <h3>Forgot Password?</h3>
              <p>Enter your email and we'll send a recovery link</p>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" style={{ width: '100%' }}>
                Send Reset Link
              </Button>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/login">Back to Sign In</Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
