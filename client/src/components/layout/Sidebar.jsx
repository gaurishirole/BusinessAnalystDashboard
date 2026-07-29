import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Sidebar.css';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserCog,
  ShoppingBag,
  TrendingUp,
  FileText,
  Bell,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { updateUserProfile } from '../../services/userService';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { logout, user, updateUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await updateUserProfile({
      id: user?.id,
      name,
      email,
      role: user?.role,
      avatar: user?.avatar
    });

    setLoading(false);
    if (result.success) {
      updateUser(result.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        setModalOpen(false);
        setMessage({ type: '', text: '' });
      }, 1000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile.' });
    }
  };

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Users', path: '/users', icon: UserCog },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Products', path: '/products', icon: TrendingUp },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const filteredLinks = links.filter((link) => {
    if (!user) return false;
    if (user.role === 'Manager') {
      const allowed = ['Dashboard', 'Analytics', 'Customers', 'Products', 'Orders', 'Reports', 'Notifications'];
      return allowed.includes(link.name);
    }
    if (user.role === 'Analyst') {
      const allowed = ['Dashboard', 'Analytics', 'Reports'];
      return allowed.includes(link.name);
    }
    return true;
  });

  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand">
        <Sparkles className="brand-icon" size={24} />
        <h2>Business Analytics</h2>
      </div>

      <nav className="sidebar-nav">
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active-link' : ''}`}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  toggleSidebar();
                }
              }}
            >
              <Icon size={18} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {user && (
        <div className="sidebar-footer">
          <div 
            className="user-profile" 
            style={{ cursor: 'pointer' }} 
            onClick={() => {
              setName(user.name);
              setEmail(user.email);
              setModalOpen(true);
            }}
          >
            <img src={user.avatar} alt="User Avatar" className="user-avatar" />
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Account Settings">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {message.text && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              color: message.type === 'success' ? 'var(--color-success, #22c55e)' : 'var(--color-danger, #ef4444)'
            }}>
              {message.text}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input 
              label="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            <Input 
              label="Email" 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <Input 
              label="Role" 
              value={user?.role || ''} 
              disabled 
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </aside>
  );
}
