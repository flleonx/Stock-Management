import React, { useEffect, useState } from "react";
import Axios from "axios";
import { baseURL } from "../app/baseURL";

import notFoundImage from "../../assets/Not Found.svg";
import ModalInformationDesign from "./ModalInformationDesign";
import "./style/ModalDesignInventory.css";

const ModalDesignInventory = ({ modalContent, closeModal }: any) => {
  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 40000);
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [referenceArray, setReferenceArray] = useState([]);
  const getreferenceconsumptionURL = baseURL + "api/getreferenceconsumption";
  let iterator = 0;
  let enableEmpty = true;
  let showEmptySearch = false;

  const handlerSearch = (e: any) => {
    setSearchTerm(e);
    iterator = 0;
    enableEmpty = true;
    showEmptySearch = false;
  };

  const handlerInfoModal = (payload: any) => {
    setIsModalOpen(true);
    setReferenceNumber(payload);
    const referenceSelection = payload;
    Axios.post(getreferenceconsumptionURL, { referenceSelection })
      .then((response) => {
        setReferenceArray(response.data);
      })
  };

  const closeModalInfo = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container_table-design">
      <div className="table_title-design">Información</div>
      <div className="search-design-container">
        <i className="gg-search"></i>
        <input
          type="search"
          placeholder="Buscar..."
          className="search-filter-design"
          onChange={(e: any) => handlerSearch(e.target.value)}
        ></input>
      </div>
      <div className="sample-image-container">
        <div className="table_header-design-sample">Muestra</div>
        <div className="table_header-design-img">Imagen</div>
      </div>
      <div className="scroll-modal-design">
        {modalContent
          .filter((val: any) => {
            iterator += 1;
            if (searchTerm === "") {
              return val;
            } else if (
              val.referencia
                .toString()
                .slice(0, searchTerm.length)
                .includes(searchTerm)
            ) {
              enableEmpty = false;
              return val;
            } else if (iterator == modalContent.length && enableEmpty == true) {
              showEmptySearch = true;
            }
          })
          .map((props: any) => {
            return (
              <div className="items_container-design" key={props.referencia}>
                <div className="items-information-container">
                  <div className="items-information-ref">
                    Referencia: {props.referencia}
                  </div>
                  <div className="items-information-size">
                    Talla: {props.talla}
                  </div>
                  <div className="items-information-description">
                    Descripción: {props.descripcion}
                  </div>
                  <div className="items-information-color">
                    Color: {props.color}
                  </div>
                  <div className="items-information-valuePerUnit">
                    Valor de la unidad: {props.valor_unidad}
                  </div>
                  <button
                    className="btn"
                    id="handleInfoModal"
                    onClick={() => handlerInfoModal(props.referencia)}
                  >
                    Información de consumo
                  </button>
                </div>
                <div className="table_item-design">
                  <img className="table_img-design" src={props.nombre_imagen} />
                </div>
              </div>
            );
          })}
        {showEmptySearch && (
          <img className="notfoundImg" src={notFoundImage} alt="Not Found" />
        )}
      </div>
      <ModalInformationDesign
        isOpen={isModalOpen}
        closeModal={closeModalInfo}
        reference={referenceNumber}
        referenceArray={referenceArray}
      />
    </div>
  );
};

export default ModalDesignInventory;
