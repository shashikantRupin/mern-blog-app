import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const { loggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={36} style={{ color: 'var(--accent-primary)' }} />
      </div>
    );
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;