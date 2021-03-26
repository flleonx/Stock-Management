import React, {useEffect} from 'react';

// INTERFACES
interface IWareHouseElements {
  codigo: number;
  color: string;
  metros?: number;
  cantidad?: number;
  descripcion: string;
  nombre_imagen: string;
  timestamp: string;
}

const ModalDesign = ({
  modalContent,
  checkNumber,
  closeModal,
}: any) => {
  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 6000);
  });
  if (checkNumber == 1 || checkNumber == 2 || checkNumber == 3 || checkNumber == 4) {
    return <AnotherMessages modalContent={modalContent} />;
  }

//   return <NotSuccessfulRequest modalContent={modalContent} />;
return <div>Error</div>
};

const AnotherMessages = (modalContent: any, index: number) => {
  return (
    <>
      <div key={index} className="ModalDesign">
        <p>AVISO: {modalContent.modalContent}</p>
      </div>
    </>
  );
};


export default ModalDesign;