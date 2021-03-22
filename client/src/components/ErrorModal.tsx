import React, { useEffect } from 'react';
import './style/ErrorModal.css';

const ErrorModal = ({ modalContent, closeModal }: any) => {
    useEffect(() => {
        setTimeout(() => {
            closeModal();
        }, 5000);
    });
    return (
        <div className="ErrorModal">
            <p>{modalContent}</p>
        </div>
    );
};

export default ErrorModal;