import React, { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
      const { loggedIn } = useContext(AuthContext);

      if (!loggedIn) {
        alert("login first");
        return <Navigate to="/login" replace />;
      }

      return children;
}

export default PrivateRoute