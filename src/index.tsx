import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HashRouter>
    <GoogleOAuthProvider clientId="1095146523031-a9mobes1iqad5vo8unoc9o6muuk3shru.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </HashRouter>
);

reportWebVitals();
