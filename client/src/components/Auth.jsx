import React, { useState } from 'react';
import { Shield, User, Lock, Mail, ArrowRight, Loader2, Key } from 'lucide-react';
import './Auth.css';

export default function Auth({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { username, password, confirmPassword, full_name } = formData;

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    if (isSignUp) {
      if (!full_name.trim()) {
        setError('Full name is required.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters.');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
      const payload = isSignUp 
        ? { username, password, full_name, role: isAdmin ? 'admin' : 'user' }
        : { username, password, role: isAdmin ? 'admin' : 'user' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(isSignUp ? 'Registration successful! Signing you in...' : 'Sign in successful!');
        
        // Auto signin after signup or direct signin
        setTimeout(() => {
          onAuthSuccess(result.user);
        }, 1000);
      } else {
        setError(result.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Unable to reach the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay animate-fadeIn">
      <div className="auth-matrix" />
      <div className="auth-glow auth-glow-purple" />
      <div className="auth-glow auth-glow-cyan" />

      <div className="auth-container glassmorphic-panel">
        <div className="auth-header">
          <div className="auth-logo-icon">
            {isAdmin ? <Shield size={28} /> : <User size={28} />}
          </div>
          <h2>AETHERIA</h2>
          <p className="text-gradient">ALL-ELECTRIC VELOCITY</p>
        </div>

        {/* Portal Role Selector */}
        <div className="role-selector-wrapper">
          <button 
            type="button"
            className={`role-btn ${!isAdmin ? 'active' : ''}`}
            onClick={() => {
              setIsAdmin(false);
              setError('');
            }}
          >
            Client Portal
          </button>
          <button 
            type="button"
            className={`role-btn ${isAdmin ? 'active' : ''}`}
            onClick={() => {
              setIsAdmin(true);
              setError('');
            }}
          >
            Registry Dashboard
          </button>
        </div>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="auth-form">
          <h3 className="auth-form-title">
            {isAdmin ? 'Admin ' : 'Client '}
            {isSignUp ? 'Registration' : 'Access Gate'}
          </h3>

          {error && <div className="auth-alert error">{error}</div>}
          {success && <div className="auth-alert success">{success}</div>}

          {isSignUp && (
            <div className="auth-group">
              <label htmlFor="full_name">Full Name</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-icon" />
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-group">
            <label htmlFor="username">Username</label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="hyper_driver"
                required
              />
            </div>
          </div>

          <div className="auth-group">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="auth-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="auth-input-wrapper">
                <Key size={16} className="auth-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="spinner" /> Authenticating...
              </>
            ) : (
              <>
                {isSignUp ? 'Create Profile' : 'Gain Entrance'} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <button 
            type="button" 
            className="auth-toggle-link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setSuccess('');
            }}
          >
            {isSignUp ? 'Already registered? Sign In' : 'First configuration? Sign Up (New User)'}
          </button>
        </div>
      </div>
    </div>
  );
}
