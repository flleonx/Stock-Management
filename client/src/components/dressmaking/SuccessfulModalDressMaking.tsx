import React, { useEffect } from "react";
import "./style/SuccessfulModalDressMaking.css";

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

const SuccessfulModalDressMaking = ({ modalContent, checkNumber, closeModal }: any) => {

  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 5000);
  });
  if (checkNumber == 1 || checkNumber == 2) {
    return <AnotherMessages modalContent={modalContent} />;
  }

  return <NotSuccessfulRequest modalContent={modalContent} />;
};

const AnotherMessages = (modalContent: any, index: number) => {
  return (
    <>
      <div key={index} className="SuccessfulModalDressMaking">
        <p>AVISO: {modalContent.modalContent}</p>
      </div>
    </>
  );
};

const NotSuccessfulRequest = (modalContent: any) => {
  const showAmount = (props: IWareHouseElements): number | undefined => {
    if (props.metros == null) {
      return props.cantidad;
    }
    return props.metros;
  };
  console.log(modalContent)

  return (
    <>
      {modalContent.modalContent.map((props: IWareHouseElements) => {
        return (
          <div key={props.codigo} className="SuccessfulModalDressMaking">
            <p>
              La referencia: {props.codigo} de color: {props.color} con
              descripción:
              {props.descripcion} no tiene suficientes existencias en bodega:
              existencias {showAmount(props)}
            </p>
            <img src={props.nombre_imagen} />
          </div>
        );
      })}
    </>
  );
};

export default SuccessfulModalDressMaking;
