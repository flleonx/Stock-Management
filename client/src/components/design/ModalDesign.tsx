import React from 'react';

import './style/ModalDesign.css';

const ModalDesign = ({modalContent, closeModal}: any) => {
  setTimeout(() => {
    closeModal();
  }, 5000);
  return (
    <div className="ModalDesignContainer">
      <h4>{modalContent}</h4>
    </div>
  );
};

export default ModalDesign;
