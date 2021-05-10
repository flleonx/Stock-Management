import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Axios from "axios";

import "./style/ModalShopsReq.css";
import errorIMG from "../../assets/error.svg";
import { baseURL } from "../app/baseURL";

const modalShopsReqId: any = document.getElementById("ModalShopsReq");

const ModalShopsReq = (props: any) => {
  const url = baseURL + "api/modalrequiredstock";
  const requiredStock = props.requiredStock;
  const [requiredStockOrdered, setRequiredStockOrdered] = useState<any>([]);

  const handleClose = () => {
    props.closeModal();
  };

  const handleDecision = (decisionNumber: number, isCompleteStock: boolean) => {
    props.handleDecision(decisionNumber, isCompleteStock);
    props.closeModal();
  };

  console.log(props.checkReqNumber);

  useEffect(() => {
    if (props.checkReqNumber !== 3) {
      Axios.post(url, requiredStock).then((response: any) => {
        setRequiredStockOrdered(response.data);
      });
    }
  }, []);

  if (!props.isOpen) return null;

  if (props.checkReqNumber === 1) {
    return ReactDOM.createPortal(
      <div className="ModalShopsComponent">
        <div className="ModalShopsComponent__container">
          <button
            onClick={handleClose}
            className="ModalShopsComponent__close-button"
          >
            X
          </button>
          <h2 className="ModalShopsComponent__h2">
            Lotes necesarios para cumplir con el pedido
          </h2>
          <p>First in, first out (FIFO)</p>
          {requiredStockOrdered.map((info: any) => {
            return (
              <div className="ModalShopsCard">
                <h4 className="ModalShopsCard__h4">Información del producto</h4>
                <div className="ModalShopsCard__lot">
                  Numero lote: {info.numero_lote}
                </div>
                <div className="ModalShopsCard__reference">
                  Referencia: {info.referencia}
                </div>
                <div className="ModalShopsCard__amount">
                  Cantidad: {info.cantidadTotal}
                </div>
              </div>
            );
          })}
          <div className="buttonsModalShopsContainer">
            <button
              className="btn buttonsModalShopsContainer__approve"
              onClick={() => handleDecision(1, true)}
            >
              Aceptar
            </button>
            <button
              className="btn buttonsModalShopsContainer__reject"
              onClick={() => handleDecision(0, true)}
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>,
      modalShopsReqId
    );
  } else if (props.checkReqNumber === 2) {
    return ReactDOM.createPortal(
      <div className="ModalShopsComponent">
        <div className="ModalShopsComponent__container">
          <button
            onClick={handleClose}
            className="ModalShopsComponent__close-button"
          >
            X
          </button>
          <h2 className="ModalShopsComponent__h2">
            ATENCIÓN: No hay el stock exacto
          </h2>
          <p>
            Para cumplir con este pedido faltarían {props.stockMissingAmount}{" "}
            productos. Si así lo deseas pueden pedir la cantidad disponible:{" "}
            {props.stockAvailableAmount} productos.
          </p>
          {requiredStockOrdered.map((info: any) => {
            return (
              <div className="ModalShopsCard">
                <h4 className="ModalShopsCard__h4">Información del producto</h4>
                <div className="ModalShopsCard__lot">
                  Numero lote: {info.numero_lote}
                </div>
                <div className="ModalShopsCard__reference">
                  Referencia: {info.referencia}
                </div>
                <div className="ModalShopsCard__amount">
                  Cantidad: {info.cantidadTotal}
                </div>
              </div>
            );
          })}
          <div className="buttonsModalShopsContainer">
            <button
              className="btn buttonsModalShopsContainer__approve"
              onClick={() => handleDecision(1, false)}
            >
              Aceptar
            </button>
            <button
              className="btn buttonsModalShopsContainer__reject"
              onClick={() => handleDecision(0, false)}
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>,
      modalShopsReqId
    );
  } else {
    return ReactDOM.createPortal(
      <div className="ModalShopsComponent">
        <div className="ModalShopsComponent__container">
          <button
            onClick={handleClose}
            className="ModalShopsComponent__close-button"
          >
            X
          </button>
          <h2 className="ModalShopsComponent__h2">
            No hay existencias de esta referencia en esta tienda
          </h2>
          <div className="imgErrorShopsContainer">
            <img
              src={errorIMG}
              alt="error image"
              className="imgErrorShopsContainer__img"
            />
          </div>
          <div className="buttonsRejectShopsModalContainer">
            <button
              className="btn buttonsRejectShopsModalContainer__reject"
              onClick={() => handleDecision(0, false)}
            >
              Rechazar Petición
            </button>
          </div>
        </div>
      </div>,
      modalShopsReqId
    );
  }
};

export default ModalShopsReq;
