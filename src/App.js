import React from 'react';

import SilentRenew from './components/silent-renew/silent-renew';
import { AuthProvider } from 'oidc-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';
import Login from './components/login/login';
import Navbar from './components/nav/navbar';

const oidcConfig = {
  onSignIn: async (user) => {
    alert('You just signed in, congratz! Check out the console!');
    console.log('signed in Provider', user);
    window.location.hash = '/';
  },
  onSignOut: async (user) => {
    alert('You just signed Out! ');
    console.log('signed out Provider', user);
    window.location.hash = '/login';
  },

  authority: process.env.REACT_APP_AUTHORITY,
  clientId: process.env.REACT_APP_CLIENT_ID,
  redirectUri: process.env.REACT_APP_REDIRECT_URI,
  postLogoutRedirectUri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI,
  silentRedirectUri: process.env.REACT_APP_SILENT_REDIRECT_URI,
  automaticSilentRenew: process.env.REACT_APP_AUTOMATIC_SILENT_RENEW,
  responseType: process.env.REACT_APP_RESPONSE_TYPE,
  scope: process.env.REACT_APP_SCOPE,
  loadUserInfo: process.env.REACT_APP_LOAD_USER_INFO,
};

function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/silent-renew' exact element={<SilentRenew />} />
          <Route path='/' exact element={<Dashboard />} />
          <Route path='/login' exact element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
