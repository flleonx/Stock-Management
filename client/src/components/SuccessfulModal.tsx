import React, {useEffect} from 'react';
import './style/SuccessfulModal.css';

const SuccessfulModal = ({modalContent, closeModal}: any) => {
  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 5000);
  });
  return (
    <div className="SuccessfulModal ">
      <p>{modalContent}</p>
    </div>
  );
};

export default SuccessfulModal;
