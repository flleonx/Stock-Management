import React from 'react';
import {withRouter, Link} from 'react-router-dom';

function Bodega() {
  return (
    <div>
      <h1>Bodega</h1>
      <Link to="/">Home</Link>
    </div>
  );
}

export default withRouter(Bodega);
