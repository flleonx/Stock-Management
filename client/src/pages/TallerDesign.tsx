import React from 'react';
import {withRouter, Link} from 'react-router-dom';

function TallerDesign() {
  return (
    <div>
      <h1>Taller diseño</h1>
      <Link to="/">Home</Link>
    </div>
  );
}

export default withRouter(TallerDesign);
