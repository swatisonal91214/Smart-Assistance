import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SmartAssistance.css';

const SmartAssistance = () => {
  const [pdfName, setPdfName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfName(file.name);
    }
  };

  const handleProcessDocument = async () => {
    setLoading(true);
    setShowChat(false);
    try {
      // Upload the file first
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append('file', file);
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
          prefix: pdfName.replace(/\.[^/.]+$/, "") || "default"
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to process document');
      }
      const data = await response.json();
      setLoading(false);
      setShowChat(true);
    } catch (error) {
      setLoading(false);
      alert(error.message || 'Error processing document');
    }
  };

  return (
    <div
      className="smart-assistance-container"
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'url(/IndustrialAutomationback.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="smart-assistance-card glass-effect"
        style={{
          width: '50vw',
          maxWidth: '600px',
          minWidth: '320px',
          margin: '60px auto',
          background: 'rgba(20, 20, 20, 0.7)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          border: '1.5px solid rgba(255,255,255,0.18)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="smart-assistance-header">
          <div className="smart-assistance-header-flex">
            <img src="/document.jfif" alt="folder" className="smart-assistance-folder shadow-img" />
            <div>
              <h2
                className="smart-assistance-title"
                style={{ fontWeight: 900, color: '#111', letterSpacing: 2 }}
              >SMART ASSISTANCE</h2>
              <h3
                className="smart-assistance-subtitle"
                style={{ fontWeight: 900, color: '#111', letterSpacing: 1 }}
              >FOR DOCUMENTS</h3>
            </div>
            <img src="/documentSearch.jfif" alt="search" className="smart-assistance-search shadow-img" />
          </div>
        </div>
        <div
          className="smart-assistance-main"
          style={{
            background: 'linear-gradient(120deg, #2a5298 0%, #b0bec5 100%)',
            borderBottomLeftRadius: '32px',
            borderBottomRightRadius: '32px',
            padding: '48px 48px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label htmlFor="pdf-upload" className="smart-assistance-upload-label">
              <div
                className="smart-assistance-upload"
                style={{
                  background: 'rgba(10, 10, 10, 0.95)',
                  borderRadius: '24px',
                  padding: '32px 0',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '2rem',
                  marginBottom: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 12px #2a5298',
                  transition: 'background 0.3s',
                }}
              >
                <img src="/DocumentUpload.jpg" alt="upload" className="smart-assistance-upload-img shadow-img" />
                <div style={{ color: '#fff', fontWeight: 700 }}>{pdfName ? pdfName : "Upload PDF"}</div>
              </div>
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handlePdfUpload}
              />
            </label>
            {pdfName && (
              !loading && !showChat && (
                <button
                  className="smart-assistance-process-btn"
                  style={{
                    marginTop: '20px',
                    padding: '12px 32px',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    background: '#2a5298',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 2px 8px #2a5298',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                  }}
                  onClick={handleProcessDocument}
                >
                  Process Document
                </button>
              )
            )}
            {loading && (
              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⏳</span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Processing document, please wait...</span>
              </div>
            )}
            {showChat && (
              <button
                className="smart-assistance-chat-btn"
                style={{
                  marginTop: '32px',
                  padding: '12px 32px',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  background: '#388e3c',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 2px 8px #388e3c',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                }}
                onClick={() => navigate('/chat')}
              >
                Start Chat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAssistance;
