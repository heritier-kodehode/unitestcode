import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthServiceContext } from '../../services/AuthService';
import { useAuth } from 'oidc-react';
import './nav.css';

const Navbar = () => {
  const auth = useAuth();

  if (auth && auth.userData) {
    return (
      <nav className='nav'>
        <ul className='nav-list'>
          <li className='user-name'>
            <Link to='/'>
              {'['} {auth.userData.profile.name} {']'}
            </Link>
          </li>
          <li>
            <button className='logout-btn' onClick={() => auth.signOut()}>
              logout
            </button>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav>
      <ul className='nav-list'>
        <li>
          <button className='logout-btn' onClick={() => auth.signIn()}>
            login
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
