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
        <div className="scroll-design-information-modal">
          {props.referenceArray.map((props: any) => {
            return (
              <div className="items_container-design" key={props.codigo}>
                <div className="items-information-design">
                  <div className="item-information-design__ref">
                    Referencia: {props.codigo}
                  </div>
                  <div className="item-information-design__amount">
                    Consumo: {props.consumptionAmount}
                  </div>
                  <div className="item-information-design__description">
                    Descripción: {props.descripcion}
                  </div>
                  <div className="item-information-design__color">
                    Color: {props.color}
                  </div>
                </div>
                <div className="item-information-design">
                  <img
                    className="item-information-image"
                    src={props.nombre_imagen}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    informationModalID
  );
};

export default ModalInformationDesign;
