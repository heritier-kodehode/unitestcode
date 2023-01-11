import React, { useState, useEffect } from 'react';
import jwtInterceptor from '../../services/jwtinterceptor';

function Dashboard() {
  return (
    <div>
      <p>Dashboard (Protected: authenticated user required)</p>
      <button>Create</button>
    </div>
  );
}

export default Dashboard;
