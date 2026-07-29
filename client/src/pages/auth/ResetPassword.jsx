import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Sparkles } from 'lucide-react';
import '../../styles/Auth.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirm) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-brand">
          <Sparkles className="brand-icon" size={28} />
          <h2>Business Analytics</h2>
        </div>

        {success ? (
          <div className="auth-header">
            <h3>Password updated</h3>
            <p>Your password has been reset successfully. Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <h3>Reset Password</h3>
              <p>Set a new, secure password for your account</p>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" style={{ width: '100%' }}>
                Reset Password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
