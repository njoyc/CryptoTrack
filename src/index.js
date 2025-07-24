/*import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();*/
// src/main.jsx or src/index.js
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import CaptchaGate from './components/CaptchaGate';
import './index.css';

const RootApp = () => {
  const [access, setAccess] = useState(false);

  return (
    access ? <App /> : <CaptchaGate onSuccess={() => setAccess(true)} />
  );
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
