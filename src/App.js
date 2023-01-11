import React, { useEffect, useState } from 'react';
import Redirect from './services/Redirect';
import { UserManager } from 'oidc-client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';
import Login from './components/login/login';
import Signup from './components/signup/signup';
import { environment } from './services/environment';
import Navbar from './components/nav/navbar';
import AuthService from './services/AuthService';

function App() {
  const clientId = '1a826c02-21ac-482e-853e-a3f86865d925';
  const auth = AuthService();

  useEffect(() => {
    console.log(auth.loggedIn);
  }, [auth.loggedIn]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Dashboard />} />
        <Route path='/login' exact element={<Login />} />
        <Route path='/signup' exact element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
