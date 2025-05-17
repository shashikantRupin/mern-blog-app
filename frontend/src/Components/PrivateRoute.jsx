import React, { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
      const { loggedIn, token, loading } = useContext(AuthContext);

      if (loading) {
        // Show a loader or nothing while checking auth
        return <div>Loading...</div>;
      }
      if (!loggedIn) {
        alert("login first");
        return <Navigate to="/login" replace />;
      }
      return children;
}

export default PrivateRoute