import React, {useEffect} from 'react';
import './style/SuccessfulModalDressMaking.css';

// INTERFACES
interface IWareHouseElements {
  codigo: number;
  color: string;
  metros?: number;
  cantidad?: number;
  descripcion: string;
  nombre_imagen: string;
  timestamp: string;
  remainingAmount: string;
}

const SuccessfulModalDressMaking = ({
  modalContent,
  checkNumber,
  closeModal,
}: any) => {
  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 40000);
  });

  return <NotSuccessfulRequest modalContent={modalContent} />;
};

const NotSuccessfulRequest = (modalContent: any) => {
  const showAmount = (props: IWareHouseElements): number | undefined => {
    if (props.metros == null) {
      return props.cantidad;
    }
    return props.metros;
  };

  return (
    <>
      <div className="container_table">
        <div className="table_title">Información</div>
        <div className="table_header">Insumo insuficiente</div>
        <div className="table_header">Imagen</div>
        {modalContent.modalContent.map((props: IWareHouseElements) => {
          return (
            <div className="items_container" key={props.codigo}>
              <div className="sub_items_container">
                <div className="sub_sub_items_container">
                  <div className="table_item">Item: {props.codigo}</div>
                  <div className="table_item">
                    Descripción: {props.descripcion}
                  </div>
                  <div className="table_item">Existencias: {props.metros}</div>
                  <div className="table_item">
                    Remanente: {props.remainingAmount}
                  </div>
                </div>
                <div className="table_item">
                  <img className="table_img" src={props.nombre_imagen} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SuccessfulModalDressMaking;
