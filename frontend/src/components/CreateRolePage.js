import React from 'react';

const CreateRolePage = () => {
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
          Create Roles
        </h2>
        <div style={{
          width: '100%',
          textAlign: 'center',
          color: '#e3eafc',
          fontSize: '1.1rem',
          fontWeight: 500,
          marginBottom: '24px',
        }}>
          Add new roles, remove existing roles, and view all roles below.
        </div>
        {/* Create Role Form */}
        <form style={{ width: '100%', maxWidth: 400, margin: '0 auto 24px auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="text" placeholder="Role Name" style={{ padding: '10px', borderRadius: '8px', border: 'none', fontSize: '1rem', background: '#f3f6fa', color: '#222' }} />
          <button type="submit" style={{ padding: '10px', borderRadius: '8px', fontWeight: 700, background: 'linear-gradient(120deg, #24518a 0%, #1a3760 100%)', color: '#fff', border: 'none', boxShadow: '0 2px 8px #24518a', cursor: 'pointer', fontSize: '1rem' }}>Create Role</button>
        </form>
        {/* Remove Role Form */}
        <form style={{ width: '100%', maxWidth: 400, margin: '0 auto 24px auto', display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <input type="text" placeholder="Role Name" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontSize: '1rem', background: '#f3f6fa', color: '#222' }} />
          <button type="submit" style={{ padding: '10px 18px', borderRadius: '8px', fontWeight: 700, background: 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)', color: '#fff', border: 'none', boxShadow: '0 2px 8px #24518a', cursor: 'pointer', fontSize: '1rem' }}>Remove Role</button>
        </form>
        {/* List of Roles (Dummy Data) */}
        <div style={{ width: '100%', maxWidth: 500, margin: '0 auto', background: '#f3f6fa', borderRadius: '12px', padding: '18px 12px', color: '#222', boxShadow: '0 2px 8px #e3eafc' }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px', color: '#24518a' }}>Current Roles</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
            <thead>
              <tr style={{ background: '#e3eafc', color: '#24518a' }}>
                <th style={{ padding: '8px', borderRadius: '6px 0 0 6px', textAlign: 'left' }}>Role Name</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '8px' }}>Engineer</td></tr>
              <tr><td style={{ padding: '8px' }}>Operator</td></tr>
              <tr><td style={{ padding: '8px' }}>Supervisor</td></tr>
              <tr><td style={{ padding: '8px' }}>Technician</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateRolePage;
