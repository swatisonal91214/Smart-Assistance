import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
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
        background: 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        borderRadius: '24px',
        color: '#fff',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        overflow: 'hidden',
      }}>
        {/* Left Image */}
        <div style={{
          flex: 1.2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%',
          height: '100%',
          background: 'linear-gradient(120deg, #24518a 0%, #1a3760 100%)', // Button color gradient
          borderTopLeftRadius: '24px',
          borderBottomLeftRadius: '24px',
        }}>
          <img src="/IndustrialAutomation.jfif" alt="Industrial Automation" style={{
            width: '80%',
            maxWidth: '340px',
            borderRadius: '18px',
            boxShadow: '0 2px 16px #24518a',
            objectFit: 'cover',
          }} />
        </div>
        {/* Right Content */}
        <div style={{
          flex: 1.2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '48px 36px',
          background: 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)',
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px',
        }}>
          <h1 style={{
            fontWeight: 800,
            fontSize: '2.6rem',
            color: '#fff',
            marginBottom: '16px',
            letterSpacing: 1,
            textAlign: 'left',
            lineHeight: 1.1,
            width: '100%',
          }}>
            Smart Assistance
          </h1>
          <h2 style={{
            fontWeight: 500,
            fontSize: '1.35rem',
            color: '#e3eafc',
            marginBottom: '32px',
            letterSpacing: 0.5,
            textAlign: 'left',
            lineHeight: 1.3,
            width: '100%',
          }}>
            AI powered guidance for Technical Operators. Upload your manual and get instant answers to your queries.
          </h2>
          <button
            style={{
              padding: '14px 40px',
              fontSize: '1.15rem',
              fontWeight: 700,
              borderRadius: '14px',
              background: 'linear-gradient(120deg, #24518a 0%, #1a3760 100%)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 2px 8px #24518a',
              cursor: 'pointer',
              transition: 'background 0.3s',
              marginTop: '12px',
              letterSpacing: 0.5,
            }}
            onClick={() => navigate('/select-role')}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
