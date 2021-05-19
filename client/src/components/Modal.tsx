import React from 'react';
import ReactDOM from 'react-dom';

import './style/Modal.css';

const modalID: any = document.getElementById('modal');

const Modal = (props: any) => {
  const handleClose = () => {
    console.log("ENTREEEEEEEE")
    props.closeModal();
  };
  if (!props.isOpen) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className="ModalComponent">
      <div className="ModalComponent__container">
        <button onClick={handleClose} className="ModalComponent__close-button">
          X
        </button>
        {props.children}
      </div>
    </div>,
    modalID
  );
};

export default Modal;
