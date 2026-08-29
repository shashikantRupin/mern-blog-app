import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Footer from './Components/Footer';
import AllRoutes from './Components/AllRoutes';
import { AuthProvider } from './Components/AuthContext';
import { ThemeProvider } from './Components/ThemeContext';
import Navbar from './Components/Nav';
import "react-confirm-alert/src/react-confirm-alert.css";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <AllRoutes />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
