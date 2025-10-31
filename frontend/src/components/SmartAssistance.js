import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SmartAssistance.css';
import LogoutButton from './LogoutButton';

const SmartAssistance = () => {
  const [pdfName, setPdfName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showDashboardBtn, setShowDashboardBtn] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  // Determine if navigated from manager dashboard
  const isManager = location.state && location.state.from === "manager";

  React.useEffect(() => {
    if (isManager) {
      setRolesLoading(true);
      fetch('http://localhost:8000/roles')
        .then(res => res.json())
        .then(data => {
          setRoles(data.roles || []);
          setRolesLoading(false);
        })
        .catch(() => {
          setRoles([]);
          setRolesLoading(false);
        });
    }
  }, [isManager]);

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfName(file.name);
    }
  };

  const handleProcessDocument = async () => {
    setLoading(true);
    setShowChat(false);
    setShowDashboardBtn(false);
    try {
      // Upload the file first
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append('file', file);
      // If manager, add role info
      if (isManager) {
        formData.append('role', selectedRole);
      }
      const uploadResponse = await fetch('http://localhost:8000/upload-file', {
        method: 'POST',
        body: formData,
      });
      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }
      const uploadData = await uploadResponse.json();
      // Now call create-embeddings with the saved file path
      const response = await fetch('http://localhost:8000/create-embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_path: uploadData.file_path,
          prefix: pdfName.replace(/\.[^/.]+$/, "") || "default",
          ...(isManager ? { role: selectedRole } : {})
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to process document');
      }
      const data = await response.json();
      setLoading(false);
      if (isManager) {
        setShowDashboardBtn(true);
      } else {
        setShowChat(true);
      }
    } catch (error) {
      setLoading(false);
      alert(error.message || 'Error processing document');
    }
  };

  return (
    <div
      className="smart-assistance-container"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(120deg, #f8fafc 0%, #e3eafc 100%)',
  backgroundImage: 'url(/IndustrialAutomationrobo.jpeg)', // Updated to new image as requested
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 8px',
        boxSizing: 'border-box',
      }}
    >
      <LogoutButton />
      <div
        className="smart-assistance-card glass-effect"
        style={{
          width: '100%',
          maxWidth: '750px',
          minWidth: '320px',
          minHeight: '520px',
          background: 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          borderRadius: '24px',
          color: '#fff',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0',
        }}
      >
        <div className="smart-assistance-header" style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 0 0 0',
          background: 'linear-gradient(120deg, #24518a 0%, #1a3760 100%)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        }}>
          <img src="/bot.png" alt="bot" style={{ width: 56, height: 56, marginRight: 18 }} />
          <div>
            <h2 style={{ fontWeight: 700, color: '#fff', letterSpacing: 1, fontSize: '1.6rem', marginBottom: 0 }}>Smart Assistance</h2>
              <h3 style={{ fontWeight: 500, color: '#fff', letterSpacing: 0.5, fontSize: '1.1rem', marginTop: 2 }}>AI powered guidance for Technical Operators</h3>
          </div>
          <img src="/search.png" alt="search" style={{ width: 56, height: 56, marginLeft: 18 }} />
        </div>
        <div
          className="smart-assistance-main"
          style={{
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 16px',
            boxSizing: 'border-box',
            background: 'linear-gradient(120deg, #f8fafc 0%, #e3eafc 100%)',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
          }}
        >
          {/* Manager role selection dropdown */}
          {isManager && (
            <div style={{
              width: '100%',
              maxWidth: '340px',
              marginBottom: '18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)',
              borderRadius: '18px',
              boxShadow: '0 2px 8px #e3eafc',
              padding: '18px 0 12px 0',
            }}>
              <label htmlFor="role-select" style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>Select Role</label>
              {rolesLoading ? (
                <div style={{ color: '#fff', fontWeight: 500, fontSize: '1rem', marginBottom: '8px' }}>Loading roles...</div>
              ) : (
                <select
                  id="role-select"
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  style={{
                    width: '80%',
                    padding: '10px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(120deg, #f8fafc 0%, #e3eafc 100%)',
                    color: '#24518a',
                    marginBottom: '4px',
                    boxShadow: '0 1px 4px #e3eafc',
                    outline: 'none',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" disabled>Select a role</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              )}
            </div>
          )}
          <label htmlFor="pdf-upload" className="smart-assistance-upload-label" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              className="smart-assistance-upload"
              style={{
                background: 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)',
                borderRadius: '24px',
                padding: '24px 0',
                color: 'red',
                fontWeight: 700,
                fontSize: '1.3rem',
                marginBottom: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px #e3eafc',
                transition: 'background 0.3s',
                width: '100%',
                maxWidth: '340px',
              }}
            >
              <img src="/upload.png" alt="upload" style={{ width: 48, height: 48, marginBottom: 8 }} />
              <div style={{ color: '#fff', fontWeight: 700 }}>Upload Your file</div>
              <div style={{ color: '#fff', fontWeight: 500, fontSize: '1rem', marginTop: '8px', textAlign: 'center' }}>
                Supported formats: .pdf, .txt, .docx
              </div>
            </div>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handlePdfUpload}
            />
            {pdfName && (
              <div style={{ color: '#888', fontWeight: 400, fontSize: '0.95rem', marginTop: '10px', textAlign: 'center' }}>
                {showChat ? 'Processed file:' : 'Uploaded file:'} <span style={{ fontSize: '0.92rem', color: '#888', fontWeight: 700 }}>{pdfName}</span>
              </div>
            )}
          </label>
          {pdfName && (
            !loading && !showChat && !showDashboardBtn && (
              <button
                className="smart-assistance-process-btn"
                style={{
                  marginTop: '18px',
                  padding: '12px 32px',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  background: selectedRole || !isManager ? 'linear-gradient(120deg, #24518a 0%, #1a3760 100%)' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 2px 8px #24518a',
                  cursor: selectedRole || !isManager ? 'pointer' : 'not-allowed',
                  transition: 'background 0.3s',
                  opacity: selectedRole || !isManager ? 1 : 0.7,
                }}
                onClick={handleProcessDocument}
                disabled={isManager && !selectedRole}
              >
                Process Document
              </button>
            )
          )}
          {loading && (
            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <span style={{ marginBottom: '12px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '48px',
                  height: '48px',
                  border: '6px solid #e3eafc',
                  borderTop: '6px solid #6fa3ef',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  background: 'linear-gradient(120deg, #f8fafc 0%, #e3eafc 100%)',
                }} />
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </span>
              <span style={{ color: '#888', fontWeight: 700, fontSize: '1.1rem' }}>Processing document, please wait...</span>
            </div>
          )}
          {showChat && (
            <button
              className="smart-assistance-chat-btn"
              style={{
                marginTop: '32px',
                padding: '12px 32px',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '12px',
                background: 'linear-gradient(120deg, #24518a 0%, #1a3760 100%)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 2px 8px #24518a',
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
              onClick={() => navigate('/chat')}
            >
              Start Chat
            </button>
          )}
          {showDashboardBtn && (
            <button
              className="smart-assistance-chat-btn"
              style={{
                marginTop: '32px',
                padding: '12px 32px',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '12px',
                background: 'linear-gradient(120deg, #24518a 0%, #1a3760 100%)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 2px 8px #24518a',
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
              onClick={() => navigate('/manager-dashboard')}
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartAssistance;
