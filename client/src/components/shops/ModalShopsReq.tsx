import React from "react";
import ReactDOM from "react-dom";

import "./style/ModalShopsReq.css";
import errorIMG from "../../assets/error.svg";

const modalShopsReqId: any = document.getElementById("ModalShopsReq");

const ModalShopsReq = (props: any) => {
  const handleClose = () => {
    props.closeModal();
  };

  const handleDecision = (decisionNumber: number) => {
    props.handleDecision(decisionNumber);
    props.closeModal();
  };

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
            Lotes necesarios para cumplir con el pedido
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
