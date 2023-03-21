import React from 'react';
import { createRoot } from 'react-dom/client';
import Settings from './components/Application';
import "tailwindcss/tailwind.css";
import './appRenderer.css';

// Application to Render
const app = (
  <React.StrictMode>
    <Settings></Settings>
  </React.StrictMode>
);

// Render application in DOM
createRoot(document.getElementById('app')).render(app);
