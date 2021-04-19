import React from 'react';
import ReactDOM from 'react-dom';

import './style/ModalAreYouSureDressmaking.css';

const idModalAreYouSureDressmaking: any = document.getElementById(
  'ModalAreYouSureDressmaking'
);

const ModalAreYouSureDressmaking = (props: any) => {
  const handleClose = () => {
    props.closeModal();
  };

  const handleAccept = () => {
    props.subAmountFunction();
    props.closeModal();
  };

  if (!props.isOpen) return null;
  return ReactDOM.createPortal(
    <div className="ModalAYSDressmakingComponent">
      <div className="ModalAYSDressmakingComponent__container">
        <button
          onClick={handleClose}
          className="ModalAYSDressmakingComponent__close-button"
        >
          X
        </button>
        <h3 className="ModalAYSDressmakingComponent__h3">¿Estás seguro?</h3>
        <p className="ModalAYSDressmakingComponent__p">
          Ten cuidado. Solo presiona el botón de aceptar si estás completamente
          seguro porque no hay vuelta atrás.
        </p>
        <div className="ARYDressmakingButtonsContainer">
          <button
            className="btn ARYDressmakingButtonsContainer__accept"
            onClick={handleAccept}
          >
            Aceptar
          </button>
          <button
            className="btn ARYDressmakingButtonsContainer__cancel"
            onClick={handleClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    idModalAreYouSureDressmaking
  );
};

export default ModalAreYouSureDressmaking;
