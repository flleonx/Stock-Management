import React from 'react';
import ReactDOM from 'react-dom';

import './style/ModalinsufficientSupplies.css';

const insufficientSuppliesID: any = document.getElementById(
  'insufficientSuppliesModal'
);

const ModalinsufficientSupplies = (props: any) => {
  const handlerButtonReject = () => {
    props.handlerReject(props.infoRequest.index);
    props.closeModal();
  };
  const handleClose = () => {
    props.closeModal();
  };
  if (!props.isOpen) return null;
  return ReactDOM.createPortal(
    <div className="ModalNoSuppliesComponent">
      <div className="ModalNoSuppliesComponent__container">
        <button
          onClick={handleClose}
          className="ModalNoSuppliesComponent__close-button"
        >
          X
        </button>
        <h4>
          Error: En el inventario no se encuentran los insumos suficientes
        </h4>
        <p>
          No se puede aceptar esta petición debido a que en Bodega no hay los
          insumos suficientes para cumplir con la producción. Por favor, rechace
          esta petición.
        </p>
        <div className="containerNoSupplies_table">
          <div className="tableNoSupplies_title">Insumos insuficientes</div>
          <div className="tableNoSupplies_header">Insumo insuficiente</div>
          <div className="tableNoSupplies_header">Imagen</div>
          {props.arrayNoSupplies.map((props: any) => {
            return (
              <div className="itemsNoSupplies_container" key={props.codigo}>
                <div className="sub_itemsNoSupplies_container">
                  <div className="sub_sub_itemsNoSupplies_container">
                    <div className="tableNoSupplies_item">
                      Item: {props.codigo}
                    </div>
                    <div className="tableNoSupplies_item">
                      Descripción: {props.descripcion}
                    </div>
                    <div className="tableNoSupplies_item">
                      Existencias: {props.metros}
                    </div>
                    <div className="tableNoSupplies_item">
                      Faltante: {props.remainingAmount}
                    </div>
                  </div>
                  <div className="tableNoSupplies_item">
                    <img
                      className="tableNoSupplies_img"
                      src={props.nombre_imagen}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="InsuficcientButtonRejectContainer"
          onClick={handlerButtonReject}
        >
          <button className="btn">Rechazar petición</button>
        </div>
      </div>
    </div>,
    insufficientSuppliesID
  );
};

export default ModalinsufficientSupplies;
