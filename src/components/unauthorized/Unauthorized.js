import React from 'react';

function Unauthorized() {
  return (
    <div style={{ color: 'black' }}>
      <h1>Unauthorized</h1>
      <p>
        You are not authorized to view this page. Please login or signup to
        continue.
      </p>
    </div>
  );
}

export default Unauthorized;
