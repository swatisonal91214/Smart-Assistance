import React, { useState } from 'react';
import './ChatComponent.css';
import { FaPaperPlane } from 'react-icons/fa';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message, prefix: "default" }),
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

  // Clear both question and answer
  const handleClear = () => {
    setMessage('');
    setAnswer('');
  };

  // Helper to format answer string to HTML
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
          fontWeight: 700,
          fontSize: '1.35rem',
          color: '#fff',
          marginBottom: '24px',
          letterSpacing: 0.5,
          textAlign: 'center',
          lineHeight: 1.4,
          width: '100%',
        }}>Welcome! You're now exploring your manual.</h2>
        <div style={{
          width: '100%',
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          background: '#f3f6fa',
          borderRadius: '32px',
          padding: '8px 8px',
          boxShadow: '0 2px 8px #e3eafc',
          boxSizing: 'border-box',
        }}>
          <textarea
            className="chat-input"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="What would you like to know about this document?"
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
        {(answer || loading) && (
          <div
            style={{
              width: 'calc(100% - 32px)',
              margin: '24px 16px 0 16px',
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
            }}
          >
            <strong>Answer:</strong>
            {answer ? (
              <div
                style={{ marginTop: '8px', whiteSpace: 'pre-line', overflowY: 'auto', maxHeight: '160px', paddingRight: '8px', flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', color: '#222' }}
              >
                {formatAnswer(answer)}
              </div>
            ) : (
              <div
                style={{ marginTop: '8px', overflowY: 'auto', maxHeight: '160px', paddingRight: '8px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}
              >
                {loading && (
                  <span style={{ width: '100%', textAlign: 'center', fontStyle: 'italic', color: '#888' }}>
                    Loading...
                  </span>
                )}
              </div>
            )}
          </div>
        )}
  {/* Keep chat card height fixed by adding minHeight to main card */}
      </div>
    </div>
  );
};

export default ChatComponent;
