import React, {useEffect} from 'react';

const ModalBodegaForm = ({modalContent, closeModal}: any) => {
  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 5000);
  });
  return (
    <div className="modal-bodega-form ">
      <p>{modalContent}</p>
    </div>
  );
};

export default ModalBodegaForm;
