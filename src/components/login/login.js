import React, { useState, useEffect } from 'react';
import AuthService from '../../services/AuthService';
import JWTInterceptor from '../../services/jwtinterceptor';
const Login = () => {
  const auth = AuthService();

  useEffect(() => {
    if (!auth.loggedIn) {
      auth.login();
    }
    console.log(auth.loggedIn);
  }, [auth.loggedIn]);
  return (
    <div>
      <JWTInterceptor />
      {auth.loggedIn ? <h1>You are logged in</h1> : <h1>Please wait...</h1>}
    </div>
  );
};

export default Login;
