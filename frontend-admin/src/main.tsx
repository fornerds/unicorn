import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

if (import.meta.env.DEV) {
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Download the React DevTools')) return;
    originalLog.apply(console, args);
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter
    basename="/admin"
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <App />
  </BrowserRouter>
);