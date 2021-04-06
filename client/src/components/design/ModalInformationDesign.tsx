import React from 'react';
import ReactDOM from 'react-dom';

import './style/ModalInformationDesign.css';

const informationModalID: any = document.getElementById('informationModal');

const ModalInformationDesign = (props: any) => {
  const handleClose = () => {
    props.closeModal();
  };
  if (!props.isOpen) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className="ModalInfoComponent">
      <div className="ModalInfoComponent__container">
        <button
          onClick={handleClose}
          className="ModalInfoComponent__close-button"
        >
          X
        </button>
        <h4>Referencia: {props.reference}</h4>
        <p>Estos son los insumos que consume la referencia {props.reference}</p>
        <div className="ModalInfoComponent__titleInformation">
          <div>Insumo</div>
          <div>Imagen</div>
        </div>
        {props.referenceArray.map((props: any) => {
          return (
            <div className="items_container-design" key={props.codigo}>
              <div className="sub_items_container-design">
                <div className="sub_sub_items_container-design">
                  <div className="table_item-design-ref">
                    Referencia: {props.codigo}
                  </div>
                  <div className="table_item-design">
                    Consumo: {props.consumptionAmount} metros
                  </div>
                  <div className="table_item-design">
                    Descripción: {props.descripcion}
                  </div>
                  <div className="table_item-design">Color: {props.color}</div>
                </div>
                <div className="table_item-design">
                  <img className="table_img-design" src={props.nombre_imagen} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>,
    informationModalID
  );
};

export default ModalInformationDesign;
