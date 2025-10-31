import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let role = (location.state && location.state.role) ? location.state.role : 'user';
    if (isLogin) {
      if (!userId || !password) {
        setError('Please enter User ID and Password');
        return;
      }
      // Login API call
      try {
        const res = await fetch('http://localhost:8000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, password })
        });
        const data = await res.json();
        if (data.success) {
          // Only allow login if auth matches expected role
          if (role === 'manager' && data.auth === 'manager') {
            // persist auth info so other pages can access user's role
            try { localStorage.setItem('auth', data.auth); localStorage.setItem('userId', userId); } catch (e) {}
            navigate('/manager-dashboard');
          } else if (role === 'admin' && data.auth === 'admin') {
            try { localStorage.setItem('auth', data.auth); localStorage.setItem('userId', userId); } catch (e) {}
            navigate('/admin-dashboard');
          } else if (role === 'user' && data.auth === 'user') {
            try { localStorage.setItem('auth', data.auth); localStorage.setItem('userId', userId); } catch (e) {}
            navigate('/user-dashboard');
          } else setError('Not authenticated');
        } else {
          setError('Not authenticated');
        }
      } catch (err) {
        setError('Server error');
      }
    } else {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      // Signup API call
      try {
        const res = await fetch('http://localhost:8000/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (data.success) {
          setUserId(data.userId);
          setIsLogin(true);
          setError('');
        } else {
          setError(data.error || 'Signup failed');
        }
      } catch (err) {
        setError('Server error');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e3eafc 100%)',
      backgroundImage: 'url(/IndustrialAutomationrobo.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 8px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        minHeight: '420px',
        background: 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        borderRadius: '24px',
        color: '#fff',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
        border: '2px solid #24518a',
      }}>
        {isLogin ? (
          <h2 style={{
            fontWeight: 800,
            fontSize: '2rem',
            color: '#fff',
            marginBottom: '24px',
            letterSpacing: 1,
            textAlign: 'center',
          }}>
            Welcome Back! Access Your Smart Assistance
          </h2>
        ) : (
          <>
            <h1 style={{
              fontWeight: 900,
              fontSize: '2.4rem',
              color: '#fff',
              marginBottom: '10px',
              letterSpacing: 1,
              textAlign: 'center',
            }}>
              Join Assistance
            </h1>
            <h3 style={{
              fontWeight: 500,
              fontSize: '1.15rem',
              color: '#e3eafc',
              marginBottom: '18px',
              letterSpacing: 0.5,
              textAlign: 'center',
            }}>
              Create Your Account
            </h3>
          </>
        )}
        <form style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '1rem',
                  background: '#f3f6fa',
                  color: '#222',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, Arial, sans-serif',
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '1rem',
                  background: '#f3f6fa',
                  color: '#222',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, Arial, sans-serif',
                }}
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '1rem',
                  background: '#f3f6fa',
                  color: '#222',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, Arial, sans-serif',
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '1rem',
                  background: '#f3f6fa',
                  color: '#222',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, Arial, sans-serif',
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '1rem',
                  background: '#f3f6fa',
                  color: '#222',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, Arial, sans-serif',
                }}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '1rem',
                  background: '#f3f6fa',
                  color: '#222',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, Arial, sans-serif',
                }}
              />
            </>
          )}
          {error && <div style={{ color: 'red', marginBottom: '12px', fontWeight: 500 }}>{error}</div>}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: '12px',
              background: 'linear-gradient(120deg, #24518a 0%, #1a3760 100%)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 2px 8px #24518a',
              cursor: 'pointer',
              transition: 'background 0.3s',
              marginTop: '8px',
              letterSpacing: 0.5,
            }}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div style={{ marginTop: '24px', textAlign: 'center', color: '#e3eafc', fontWeight: 500 }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            style={{ color: '#fff', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage;
