import React from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';

import './nav.css';

const Navbar = ({ user }) => {
  const auth = AuthService();

  
  return (
    <nav>
      <ul>
        <li>
          <Link to='/'>Dashboard</Link>
        </li>
        <li>
          <Link to='/login'>login</Link>
        </li>
        <li>
          <Link to='/signup'>Signup</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
