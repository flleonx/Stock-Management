import React, {useEffect} from 'react';
import './style/RegisterSuccessfulModal.css';

const RegisterSuccessfulModal = ({modalContent, closeModal}: any) => {
  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 5000);
  });
  return (
    <div className="RegisterSuccessfulModal ">
      <p>{modalContent}</p>
    </div>
  );
};

export default RegisterSuccessfulModal;
