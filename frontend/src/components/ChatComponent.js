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

  return (
    <div className="chat-container" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e3eafc 100%)',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        background: '#fff',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 className="chat-title" style={{
          fontWeight: 900,
          fontSize: '2.2rem',
          color: '#222',
          marginBottom: '32px',
          letterSpacing: 1,
        }}>What's on the agenda today?</h2>
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          background: '#f3f6fa',
          borderRadius: '32px',
          padding: '8px 16px',
          boxShadow: '0 2px 8px #e3eafc',
        }}>
          <span style={{ fontSize: '1.5rem', color: '#888', marginRight: '8px' }}>+</span>
          <input
            type="text"
            className="chat-input"
            value={message}
            onChange={handleChange}
            placeholder="Ask anything"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '1.2rem',
              color: '#222',
              padding: '8px',
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
        {answer && (
          <div style={{
            width: '100%',
            marginTop: '24px',
            background: '#f3f6fa',
            borderRadius: '16px',
            padding: '16px',
            color: '#222',
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px #e3eafc',
          }}>
            <strong>Answer:</strong> {answer}
          </div>
        )}
        {loading && (
          <div style={{ marginTop: '24px', color: '#888', fontSize: '1.1rem' }}>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
