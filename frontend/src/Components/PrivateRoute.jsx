import React, { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
      const { loggedIn } = useContext(AuthContext);

      if (!loggedIn) {
        return <Navigate to="/login" replace />;
      }

      return children;
}

export default PrivateRoute