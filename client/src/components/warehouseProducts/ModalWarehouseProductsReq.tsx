import React from "react";
import ReactDOM from "react-dom";

import "./style/ModalWarehouseProductsReq.css";
import errorIMG from "../../assets/error.svg";

const IDWarehouseProductsReq: any = document.getElementById(
  "warehouseProductsReq"
);

const ModalWarehouseProductsReq = (props: any) => {
  const handleClose = () => {
    props.closeModal();
  };

  const handlerReject = () => {
    props.handlerRefuse(props.index);
    props.closeModal();
  };

  const handlerPartialDelivery = () => {
    props.handlerPartialDelivery(props.index);
    props.closeModal();
  };

  const handlerApprove = () => {
    props.handlerAccept(props.index);
    props.closeModal();
  };
  console.log(props.infoReq);

  if (!props.isOpen) return null;
  if (props.checkReqNumber === 1) {
    return ReactDOM.createPortal(
      <div className="ModalWarehouseProductsComponent">
        <div className="ModalWarehouseProductsComponent__container">
          <button
            onClick={handleClose}
            className="ModalWarehouseProductsComponent__close-button"
          >
            X
          </button>
          <h2 className="ModalWarehouseProductsComponent__h2">
            Lotes necesarios para cumplir con el pedido
          </h2>
          <p>First in, first out (FIFO)</p>
          {props.infoReq.map((info: any) => {
            return (
              <div className="successModalCard">
                <h4 className="successModalCard__h4">
                  Información del producto
                </h4>
                <div className="successModalCard__lot">
                  Numero lote: {info.numero_lote}
                </div>
                <div className="successModalCard__reference">
                  Referencia: {info.referencia}
                </div>
                <div className="successModalCard__order">
                  # de orden: {info.numero_de_orden}
                </div>
                <div className="successModalCard__amount">
                  Cantidad: {info.cantidad}
                </div>
                <div className="successModalCard__date">
                  Fecha: {info.timestamp.replace("T", " ").slice(0, 16)}
                </div>
              </div>
            );
          })}
          <div className="buttonssuccessModalContiner">
            <button
              className="btn buttonsSuccessModalContiner__approve"
              onClick={handlerApprove}
            >
              Aceptar
            </button>
            <button
              className="btn buttonsSuccessModalContiner__reject"
              onClick={handlerReject}
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>,
      IDWarehouseProductsReq
    );
  } else if (props.checkReqNumber === 2) {
    return ReactDOM.createPortal(
      <div className="ModalWarehouseProductsComponent">
        <div className="ModalWarehouseProductsComponent__container">
          <button
            onClick={handleClose}
            className="ModalWarehouseProductsComponent__close-button"
          >
            X
          </button>
          <h2 className="ModalWarehouseProductsComponent__h2">
            Cantidad insuficiente
          </h2>
          <p>
            No se puede aceptar esta petición debido a que no hay cantidad
            suficiente del siguiente producto.
          </p>
          {props.infoReq.map((info: any) => {
            return (
              <div className="successModalCard">
                <h4 className="successModalCard__h4">
                  Información del producto
                </h4>
                <div className="successModalCard__lot">
                  Numero lote: {info.numero_lote}
                </div>
                <div className="successModalCard__reference">
                  Referencia: {info.referencia}
                </div>
                <div className="successModalCard__order">
                  # de orden: {info.numero_de_orden}
                </div>
                <div className="successModalCard__amount">
                  Cantidad: {info.cantidad}
                </div>
                <div className="successModalCard__date">
                  Fecha: {info.timestamp.replace("T", " ").slice(0, 16)}
                </div>
              </div>
            );
          })}
          <div className="buttonRejectContainer">
            <button
              className="btn buttonRejectContainer__Reject"
              onClick={handlerPartialDelivery}
            >
              PET PARCIAL
            </button>
            <button
              className="btn buttonRejectContainer__Reject"
              onClick={handlerReject}
            >
              Rechazar petición
            </button>
          </div>
        </div>
      </div>,
      IDWarehouseProductsReq
    );
  } else {
    return ReactDOM.createPortal(
      <div className="ModalWarehouseProductsComponent">
        <div className="ModalWarehouseProductsComponent__container">
          <button
            onClick={handleClose}
            className="ModalWarehouseProductsComponent__close-button"
          >
            X
          </button>
          <h2 className="ModalWarehouseProductsComponent__h2">
            Aviso: No hay existencias.
          </h2>
          <div className="imgErrorWarehouseProductContainer">
            <img
              src={errorIMG}
              alt="error image"
              className="imgErrorWarehouseProductContainer__img"
            />
          </div>
          <div className="buttonssuccessModalContiner">
            <button
              className="btn buttonsSuccessModalContiner__reject"
              onClick={handlerReject}
            >
              Rechazar Petición
            </button>
          </div>
        </div>
      </div>,
      IDWarehouseProductsReq
    );
  }
};

export default ModalWarehouseProductsReq;
