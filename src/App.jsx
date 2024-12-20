import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ConnectWallet from './ConnectWallet';
import ErrorPage from './ErrorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<NavigateToConnect />}
        />
        <Route path="/connect" element={<ConnectWithParams />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

const NavigateToConnect = () => {
  const userId = new URLSearchParams(window.location.search).get('userId');
  return userId ? <Navigate to={`/connect?userId=${userId}`} /> : <Navigate to="/error" />;
};

const ConnectWithParams = () => {
  const userId = new URLSearchParams(window.location.search).get('userId');

  if (!userId) {
    return <Navigate to="/error" />;
  }

  return <ConnectWallet userId={userId} />;
};

export default App;
