import React, { useState, useEffect, useContext } from 'react';
import { AuthServiceContext } from '../../services/AuthService';
import { useAuth, withAuth } from 'oidc-react';

const Login = () => {
  const auth = useAuth();

  useEffect(() => {
    if (!auth && !auth.userData) {
      auth.signIn();
    } else {
      window.location.hash = '/';
    }
  }, []);

  return <div></div>;
};

export default withAuth(Login);
