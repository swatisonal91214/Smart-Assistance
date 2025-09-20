
import React, { useState, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ChatComponent.css';

const RoleDocsChat = () => {
  // For demo, hardcode role. Replace with context or prop as needed.
  const role = 'Operator';
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch document names for the role
    setDocsLoading(true);
    fetch(`http://localhost:8000/role-docs?role=${role}`)
      .then(res => res.json())
      .then(data => {
        setDocuments(data.documents || []);
        setDocsLoading(false);
      })
      .catch(() => {
        setDocuments([]);
        setDocsLoading(false);
      });
  }, [role]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch("http://localhost:8000/role-docs-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message, role }),
      });
      if (!response.ok) throw new Error("Failed to get answer");
      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("Error: " + (err.message || "Unable to get answer"));
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleClear = () => {
    setMessage('');
    setAnswer('');
  };

  function formatAnswer(text) {
    return text || '';
  }

  return (
    <div className="chat-container" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e3eafc 100%)',
      backgroundImage: 'url(/IndustrialAutomationrobo.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: '24px 8px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '750px',
        background: 'linear-gradient(120deg, #6fa3ef 0%, #3b6cb7 100%)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'relative',
      }}>
        <button
          className="chat-clear-btn"
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            background: '#fff',
            border: '1px solid #2a5298',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#2a5298',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 1px 4px #e3eafc',
            zIndex: 2,
          }}
          onClick={handleClear}
          title="Clear"
        >
          ×
        </button>
        <h2 className="chat-title" style={{
          fontWeight: 800,
          fontSize: '2.1rem',
          color: '#fff',
          marginBottom: '8px',
          letterSpacing: 0.5,
          textAlign: 'center',
          lineHeight: 1.2,
          width: '100%',
        }}>RoleDocsChat</h2>
        <div style={{
          fontSize: '1.15rem',
          color: '#e3eafc',
          textAlign: 'center',
          marginBottom: '24px',
          fontWeight: 500,
          letterSpacing: 0.2,
        }}>
          Access and chat with your role documents.
        </div>
        {/* Document box above chat input */}
        <div style={{
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto 18px auto',
          background: 'rgba(255,255,255,0.18)',
          borderRadius: '18px',
          boxShadow: '0 2px 8px #e3eafc',
          padding: '18px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#24518a', marginBottom: '8px' }}>
            Documents for role: <span style={{ color: '#3b6cb7', fontWeight: 800 }}>{role}</span>
          </div>
          {docsLoading ? (
            <div style={{ color: '#888', fontWeight: 500, fontSize: '1rem' }}>Loading documents...</div>
          ) : (
            documents.length > 0 ? (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', width: '100%' }}>
                {documents.map((doc, idx) => (
                  <li key={doc} style={{
                    background: 'linear-gradient(120deg, #e3eafc 0%, #f8fafc 100%)',
                    borderRadius: '12px',
                    padding: '8px 14px',
                    marginBottom: '8px',
                    color: '#24518a',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 1px 4px #e3eafc',
                  }}>{doc}</li>
                ))}
              </ul>
            ) : (
              <div style={{ color: '#888', fontWeight: 500, fontSize: '1rem' }}>No documents found for this role.</div>
            )
          )}
        </div>
        {/* Chat input area */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', marginBottom: 0 }}>
          <img src="/human.png" alt="human" style={{ width: 32, height: 32, marginRight: 12, borderRadius: '50%', marginTop: 8 }} />
          <div style={{ flex: 1 }}>
            <div style={{
              background: '#f3f6fa',
              borderRadius: '32px',
              padding: '8px 8px',
              boxShadow: '0 2px 8px #e3eafc',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
            }}>
              <textarea
                className="chat-input"
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your role documents..."
                rows={3}
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '1.1rem',
                  color: '#222',
                  padding: '12px',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  overflowY: 'auto',
                  minHeight: '48px',
                  maxHeight: '200px',
                  width: '100%',
                  fontFamily: 'Inter, Arial, sans-serif',
                }}
              />
              <button
                className="chat-send-btn"
                style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={handleSend}
                disabled={loading}
              >
                <FaPaperPlane size={22} color="#2a5298" />
              </button>
            </div>
          </div>
        </div>
        {(answer || loading) && (
          <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', marginTop: 20 }}>
            <img src="/bot.png" alt="bot" style={{ width: 32, height: 32, marginRight: 12, borderRadius: '50%', marginTop: 8 }} />
            <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  background: '#f3f6fa',
                  borderRadius: '32px',
                  padding: '16px',
                  color: '#222',
                  fontSize: '1.1rem',
                  boxShadow: '0 2px 8px #e3eafc',
                  maxHeight: '220px',
                  minHeight: '120px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  fontFamily: 'Inter, Arial, sans-serif',
                  justifyContent: 'flex-start',
                  wordBreak: 'break-word',
                  marginRight: 0,
                }}
              >
                <strong>Answer:</strong>
                {answer ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '8px' }}>
                    <div
                      style={{ whiteSpace: 'pre-line', overflowY: 'auto', maxHeight: '160px', paddingRight: '8px', flex: 1, color: '#222', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', wordBreak: 'break-word' }}
                    >
                      {formatAnswer(answer)}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{ marginTop: '8px', overflowY: 'auto', maxHeight: '160px', paddingRight: '8px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', wordBreak: 'break-word' }}
                  >
                    {loading && (
                      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <span style={{
                          display: 'inline-block',
                          width: '36px',
                          height: '36px',
                          border: '5px solid #e3eafc',
                          borderTop: '5px solid #6fa3ef',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          background: 'linear-gradient(120deg, #f8fafc 0%, #e3eafc 100%)',
                          marginBottom: '8px',
                        }} />
                        <style>{`
                          @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }
                        `}</style>
                        <span style={{ width: '100%', textAlign: 'center', fontStyle: 'italic', color: '#888', fontWeight: 500 }}>
                          Getting your Answer ready !!
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <button
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
          onClick={() => navigate('/user-dashboard')}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default RoleDocsChat;
