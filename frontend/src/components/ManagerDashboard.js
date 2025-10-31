import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const ManagerDashboard = () => {
  const navigate = useNavigate();
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
      <LogoutButton />
      <div style={{
        width: '100%',
        maxWidth: '900px',
        minHeight: '520px',
        background: 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        borderRadius: '24px',
        color: '#fff',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 0',
      }}>
        <h2 style={{
          fontWeight: 800,
          fontSize: '2.2rem',
          color: '#24518a',
          marginBottom: '32px',
          letterSpacing: 1,
          textAlign: 'center',
        }}>
          Manager Dashboard
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          width: '100%',
          maxWidth: '700px',
        }}>
          <div style={{
            background: 'linear-gradient(120deg, #24518a 0%, #1a3760 100%)',
            borderRadius: '18px',
            boxShadow: '0 4px 16px rgba(60,100,180,0.10)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 32px',
            minWidth: '220px',
            maxWidth: '300px',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff', marginBottom: '18px', textAlign: 'center' }}>Upload Document</div>
            <button
              style={{
                padding: '10px 28px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                background: 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 2px 8px #24518a',
                cursor: 'pointer',
                transition: 'background 0.3s',
                marginTop: '8px',
                letterSpacing: 0.5,
              }}
              onClick={() => navigate('/upload', { state: { from: "manager" } })}
            >
              Go
            </button>
          </div>
          <div style={{
            background: 'linear-gradient(120deg, #24518a 0%, #1a3760 100%)',
            borderRadius: '18px',
            boxShadow: '0 4px 16px rgba(60,100,180,0.10)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 32px',
            minWidth: '220px',
            maxWidth: '300px',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff', marginBottom: '18px', textAlign: 'center' }}>Manage Roles</div>
            <button
              style={{
                padding: '10px 28px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                background: 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 2px 8px #24518a',
                cursor: 'pointer',
                transition: 'background 0.3s',
                marginTop: '8px',
                letterSpacing: 0.5,
              }}
              onClick={() => navigate('/manager-roles')}
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
