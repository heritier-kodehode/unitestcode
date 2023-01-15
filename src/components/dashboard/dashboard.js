import React, { useState, useEffect, useContext } from 'react';

import { useAuth, withAuth } from 'oidc-react';

import './dashboard.css';
import List from '../list/list';

function Dashboard() {
  const auth = useAuth();

  useEffect(() => {
    if (auth && auth.userData && auth.userData.expires_in < 100) {
      refreshToken();
    }
    return refreshToken;
  }, [auth, auth.userData]);

  function refreshToken() {
    const userManager = auth.userManager;
    userManager.getUser().then((user) => {
      if (user && user.expired) {
        userManager.signinSilent().then(() => {
          console.log('Token refreshed successfully');
        });
      }
    });
  }

  if (auth && auth.userData) {
    return (
      <div>
        <List />
      </div>
    );
  }
  return (
    <div className='login-prompt'>
      <h1 className='blink'>
        {'>'}Please Login{'<'}
      </h1>
    </div>
  );
}

export default withAuth(Dashboard);
