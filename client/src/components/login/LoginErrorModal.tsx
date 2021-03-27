import React, {useEffect} from 'react';
import './style/LoginErrorModal.css';

const LoginErrorModal = ({modalContent, closeModal}: any) => {
  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 5000);
  });
  return (
    <div className="LoginErrorModal">
      <p>{modalContent}</p>
    </div>
  );
};

export default LoginErrorModal;
