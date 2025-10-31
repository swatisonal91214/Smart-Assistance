import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const LogoutButton = ({ style }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Optionally clear user session here
    navigate('/');
  };
  return (
    <button
      onClick={handleLogout}
      title="Logout"
      style={{
        position: 'fixed',
        top: 24,
        right: 32,
        zIndex: 1000,
        background: 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)',
        border: 'none',
        borderRadius: '50%',
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px #e3eafc',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        color: '#fff',
        fontSize: '1.7rem',
        ...style,
      }}
      onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px #6fa3ef'}
      onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px #e3eafc'}
    >
      <FiLogOut />
    </button>
  );
};

export default LogoutButton;
