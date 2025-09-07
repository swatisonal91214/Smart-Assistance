import React from 'react';
import { useNavigate } from 'react-router-dom';

const boxColor = 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)';
const roles = [
  {
    name: 'User',
    description: 'Access manuals, ask questions, and get instant AI-powered answers.',
    icon: '/human.png',
    route: '/user',
    color: boxColor,
  },
  {
    name: 'Manager',
    description: 'Manage documents, view analytics, and oversee user activity.',
    icon: '/search.png',
    route: '/manager',
    color: boxColor,
  },
  {
    name: 'Admin',
    description: 'Full control over platform settings, roles, and permissions.',
    icon: '/bot.png',
    route: '/admin',
    color: boxColor,
  },
];

const RoleSelectionPage = () => {
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
      <div style={{
        width: '100%',
        maxWidth: '900px',
        minHeight: '520px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        borderRadius: '24px',
        color: '#fff',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(2px)',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '700px',
          margin: '0 auto',
          background: 'linear-gradient(120deg, #24518a 0%, #1a3760 100%)',
          borderRadius: '18px',
          boxShadow: '0 4px 24px rgba(60,100,180,0.10)',
          padding: '48px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontWeight: 800,
            fontSize: '2.2rem',
            color: '#fff',
            marginBottom: '32px',
            letterSpacing: 1,
            textAlign: 'center',
          }}>
            Select Your Role
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: '32px',
            width: '100%',
            maxWidth: '800px',
          }}>
            {roles.map((role) => (
              <div
                key={role.name}
                style={{
                  flex: 1,
                  background: role.color,
                  borderRadius: '18px',
                  boxShadow: '0 4px 16px rgba(60,100,180,0.10)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '36px 18px',
                  minWidth: '180px',
                  maxWidth: '240px',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => navigate('/login', { state: { role: role.name.toLowerCase() } })}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src={role.icon} alt={role.name} style={{ width: 56, height: 56, marginBottom: 18, borderRadius: '50%', boxShadow: '0 2px 8px #e3eafc' }} />
                <div style={{ fontWeight: 700, fontSize: '1.3rem', color: '#fff', marginBottom: '12px', textAlign: 'center' }}>{role.name}</div>
                <div style={{ fontWeight: 400, fontSize: '1rem', color: '#e3eafc', marginBottom: '24px', textAlign: 'center', minHeight: '48px' }}>{role.description}</div>
                <button
                  style={{
                    padding: '10px 28px',
                    fontSize: '1rem',
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
                  onClick={e => { e.stopPropagation(); navigate('/login', { state: { role: role.name.toLowerCase() } }); }}
                >
                  Enter
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
