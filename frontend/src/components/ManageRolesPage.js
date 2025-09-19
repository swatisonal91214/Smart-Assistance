import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000'; // Change if backend runs elsewhere

const ManageRolesPage = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (e) {
      setError('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Assign role handler
  const handleAssignRole = async (e) => {
    e.preventDefault();
    setAssignLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/assign-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role })
      });
      const data = await res.json();
      if (data.success) {
        setUserId('');
        setRole('');
        fetchUsers();
      } else {
        setError(data.error || 'Failed to assign role');
      }
    } catch (e) {
      setError('Failed to assign role');
    }
    setAssignLoading(false);
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
        maxWidth: '700px',
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
      }}>
        <h2 style={{
          fontWeight: 800,
          fontSize: '2rem',
          color: '#24518a',
          marginBottom: '24px',
          letterSpacing: 1,
          textAlign: 'center',
        }}>
          Manage Roles
        </h2>
        <div style={{
          width: '100%',
          textAlign: 'center',
          color: '#e3eafc',
          fontSize: '1.1rem',
          fontWeight: 500,
          marginBottom: '24px',
        }}>
          Assign roles to users, remove roles, and view current assignments below.
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {/* Assign Role Form */}
        <form onSubmit={handleAssignRole} style={{ width: '100%', maxWidth: 400, margin: '0 auto 24px auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="text" value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID" style={{ padding: '10px', borderRadius: '8px', border: 'none', fontSize: '1rem', background: '#f3f6fa', color: '#222' }} />
          <select value={role} onChange={e => setRole(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: 'none', fontSize: '1rem', background: '#f3f6fa', color: '#222' }}>
            <option value="">Select Role</option>
            <option value="Engineer">Engineer</option>
            <option value="Operator">Operator</option>
            {/* Add more roles as needed */}
          </select>
          <button type="submit" disabled={assignLoading} style={{ padding: '10px', borderRadius: '8px', fontWeight: 700, background: 'linear-gradient(120deg, #24518a 0%, #1a3760 100%)', color: '#fff', border: 'none', boxShadow: '0 2px 8px #24518a', cursor: 'pointer', fontSize: '1rem' }}>{assignLoading ? 'Assigning...' : 'Assign Role'}</button>
        </form>
        {/* Remove Role for Existing User */}
        {/* ...existing code... */}
        {/* List of Users and Roles */}
        <div style={{ width: '100%', maxWidth: 500, margin: '0 auto', background: '#f3f6fa', borderRadius: '12px', padding: '18px 12px', color: '#222', boxShadow: '0 2px 8px #e3eafc' }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px', color: '#24518a' }}>Current Users & Roles</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
            <thead>
              <tr style={{ background: '#e3eafc', color: '#24518a' }}>
                <th style={{ padding: '8px', borderRadius: '6px 0 0 6px', textAlign: 'left' }}>User ID</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={2} style={{ padding: '8px', textAlign: 'center' }}>No users found</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.userId}>
                    <td style={{ padding: '8px' }}>{u.userId}</td>
                    <td style={{ padding: '8px' }}>{u.role || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageRolesPage;
