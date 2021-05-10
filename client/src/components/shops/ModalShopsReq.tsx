import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Axios from "axios";

import "./style/ModalShopsReq.css";
import errorIMG from "../../assets/error.svg";
import { baseURL } from "../app/baseURL";

const modalShopsReqId: any = document.getElementById("ModalShopsReq");

const ModalShopsReq = (props: any) => {
  const url = baseURL + "api/modalrequiredstock";
  const requiredStock = props.requiredStock;

  const handleClose = () => {
    props.closeModal();
  };

  const handleDecision = (decisionNumber: number) => {
    props.handleDecision(decisionNumber);
    props.closeModal();
  };

  console.log(props.checkReqNumber);

  useEffect(() => {
    if (props.checkReqNumber !== 3) {
        Axios.post(url, requiredStock ).then((response: any) => {
            console.log(response.data);
          });
    }
  }, []);

  if (!props.isOpen) return null;

  if (props.checkReqNumber === 3) {
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
          <div className="buttonssuccessShopsModalContainer">
            <button
              className="btn buttonssuccessShopsModalContainer__reject"
              onClick={() => handleDecision(0)}
            >
              Rechazar Petición
            </button>
          </div>
        </div>
      </div>,
      modalShopsReqId
    );
  }

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
      </div>
    </div>,
    modalShopsReqId
  );
};

export default ModalShopsReq;
