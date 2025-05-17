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
  const getTime = (createdAt = "2025-01-01T04:36:03") => {
    const dateObj = new Date(createdAt);

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();

    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return `${day}th`;
      switch (day % 10) {
        case 1:
          return `${day}st`;
        case 2:
          return `${day}nd`;
        case 3:
          return `${day}rd`;
        default:
          return `${day}th`;
      }
    };

    return `${getOrdinalSuffix(day)} ${month} ${year}`;
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
        getTime,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
