import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';

import './style/ModalDecisionSupplies.css';
import {baseURL} from '../app/baseURL';

const idModalDecisionSupplies: any = document.getElementById(
  'ModalDecisionSupplies'
);

const ModalDecisionSupplies = (props: any) => {
  const informationSuppliesURL: string = baseURL + 'api/temporal';
  const [informationSupplies, setInformationSupplies] = useState([]);

  useEffect(() => {
    if (props.isOpen) {
      Axios.post(informationSuppliesURL, {
        referenceSelection: props.infoRequest.reference,
        actualAmount: props.infoRequest.amount,
      })
        .then((response: any) => {
          setInformationSupplies(response.data);
        })
    }
  }, [props.isOpen]);

  const handlerButtonReject = () => {
    props.handlerReject(props.infoRequest.index);
    props.closeModal();
  };

  const handlerButtonAccept = () => {
    props.handlerAccept(props.infoRequest.index);
    props.closeModal();
  };

  const handlerClose = () => {
    props.closeModal();
  };

  if (!props.isOpen) return null;

  return ReactDOM.createPortal(
    <div className="ModalDecisionSuppliesComponent">
      <div className="ModalDecisionSuppliesComponent__container">
        <button
          onClick={handlerClose}
          className="ModalDecisionSuppliesComponent__close-button"
        >
          X
        </button>
        <h4>Información de los insumos</h4>
        <p>
          Si aceptas esta decisión, estos serán los insumos que se verán
          afectados.
        </p>
        <div className="containerDecisionSupplies_table">
          <div className="tableDecisionSupplies_title">Insumos Necesarios</div>
          <div className="tableDecisionSupplies_header">
            Información del insumo
          </div>
          <div className="tableDecisionSupplies_header">Imagen</div>
          {informationSupplies.map((props: any) => {
            return (
              <div
                className="itemsDecisionSupplies_container"
                key={props.codigo}
              >
                <div className="sub_itemsDecisionSupplies_container">
                  <div className="sub_sub_itemsDecisionSupplies_container">
                    <div className="tableDecisionSupplies_item">
                      Item: {props.codigo}
                    </div>
                    <div className="tableDecisionSupplies_item">
                      Color: {props.color}
                    </div>
                    <div className="tableDecisionSupplies_item">
                      Descripción: {props.descripcion}
                    </div>
                    <div className="tableDecisionSupplies_item">
                      Consumo: {props.amount}
                      {props.metros ? ' metros' : ''}
                    </div>
                  </div>
                  <div className="tableDecisionSupplies_item">
                    <img
                      className="tableDecisionSupplies_img"
                      src={props.nombre_imagen}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="DecisionButtonsContainer">
          <button
            className="btn DecisionButtonsContainer__accept"
            onClick={handlerButtonAccept}
          >
            Aceptar
          </button>
          <button
            className="btn DecisionButtonsContainer__reject"
            onClick={handlerButtonReject}
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>,
    idModalDecisionSupplies
  );
};

export default ModalDecisionSupplies;
