import React from 'react';
import {withRouter, Link} from 'react-router-dom';
// import './style/Bodega.css';

function Bodega() {
  return (
    <div className="general-container-bodega">
      <h2 className="general-container-bodeg__h2">Bodega</h2>
      <p className="general-container-bodeg__p">
        ¡Hola!, ¿Hay insumos nuevos que agregar o solo echarás un vistazo?
      </p>
    </div>
  );
}

export default withRouter(Bodega);
