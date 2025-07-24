import React, { useEffect, useState } from 'react';

const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < 5; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const CaptchaGate = ({ onSuccess }) => {
  const [captcha, setCaptcha] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setUserInput('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() === captcha) {
      onSuccess();
    } else {
      setError('❌ Incorrect CAPTCHA. Try again.');
      refreshCaptcha();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        padding: '30px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '10px', color: '#007bff' }}>🚪 Enter CryptoTrack</h2>
        <p style={{ marginBottom: '20px', fontSize: '15px', color: '#555' }}>Solve the CAPTCHA below to continue</p>

        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          letterSpacing: '6px',
          padding: '12px 24px',
          backgroundColor: '#e0e0e0',
          borderRadius: '8px',
          marginBottom: '20px',
          userSelect: 'none',
          fontFamily: 'monospace',
        }}>
          {captcha}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter CAPTCHA"
            required
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
          <button type="submit" style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Enter
          </button>
        </form>

        <button
          onClick={refreshCaptcha}
          style={{
            marginTop: '12px',
            fontSize: '14px',
            color: '#007bff',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          🔁 Refresh CAPTCHA
        </button>

        {error && <p style={{ color: 'red', marginTop: '12px' }}>{error}</p>}
      </div>
    </div>
  );
};

export default CaptchaGate;
