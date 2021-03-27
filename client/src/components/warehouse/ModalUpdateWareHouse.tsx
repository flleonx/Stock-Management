import React, {useEffect} from 'react';

const ModalUpdateWareHouse = ({modalContent, closeModal}: any) => {
  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 50000);
  });
  return (
    <div className="ModalUpdateWareHouse ">
      <p>{modalContent}</p>
    </div>
  );
};

export default ModalUpdateWareHouse;
