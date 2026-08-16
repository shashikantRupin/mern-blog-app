import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NotFound = () => {
  return (
    <div className="container" style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: '72px', fontWeight: '800', fontFamily: 'var(--font-heading)', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1', marginBottom: '16px' }}>
        404
      </div>
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '460px', marginBottom: '28px', lineHeight: '1.6' }}>
        The page you are looking for might have been moved, deleted, or perhaps never existed in the first place.
      </p>
      <Link to="/" className="btn-primary">
        <ArrowBackIcon fontSize="small" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
