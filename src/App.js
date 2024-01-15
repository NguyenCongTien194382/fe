// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Register from '../src/components/account/register';
import Login from '../src/components/account/login';
import Profile from '../src/components/account/profile';
import HomePage from './components/homePage';
import WelcomePage from './components/welcomePage';
import Personal from './components/personal/personal';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/" element={<WelcomePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
