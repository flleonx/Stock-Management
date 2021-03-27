import React, {useEffect} from 'react';
import './style/RegisterErrorModal.css';

const RegisterErrorModal = ({modalContent, closeModal}: any) => {
  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 5000);
  });
  return (
    <div className="RegisterErrorModal">
      <p>{modalContent}</p>
    </div>
  );
};

export default RegisterErrorModal;
