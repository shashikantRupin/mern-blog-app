import React, { createContext, useState, useEffect } from 'react';
import { confirmAlert } from "react-confirm-alert";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState({});
  
  const confirmAction = (title, message) => {
    return new Promise((resolve) => {
      confirmAlert({
        title: title,
        message: message,
        buttons: [
          {
            label: "Yes",
            onClick: () => resolve(true),
          },
          {
            label: "No",
            onClick: () => resolve(false),
          },
        ],
      });
    });
  };
  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setLoggedIn(true);
    }
  }, []);
 
  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        token,
        setToken,
        user,
        setUser,
        confirmAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
