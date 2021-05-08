import React, { useState } from "react";

import notFoundImage from "../../assets/Not Found.svg";
import "./style/InfoShopsInventory.css";

const InfoShopsInventory = (props: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  let iterator = 0;
  let enableEmpty = true;
  let showEmptySearch = false;

  const handleSearch = (e: any) => {
    setSearchTerm(e);
    iterator = 0;
    enableEmpty = true;
    showEmptySearch = false;
  };

  return (
    <div className="container_table-shops">
      <div className="table_title-shops">Información</div>
      <div className="search-shops-container">
        <i className="gg-search"></i>
        <input
          type="search"
          placeholder="Buscar por referencia..."
          className="search-filter-shops"
          onChange={(e: any) => handleSearch(e.target.value)}
        ></input>
      </div>
      <div className="sample-image-shops-container">
        <div className="table_header-shops-sample">Producto</div>
        <div className="table_header-shops-img">Imagen</div>
      </div>
      <div className="scroll-modal-shops">
        {props.arrayInformation
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
            } else if (
              iterator == props.arrayInformation.length &&
              enableEmpty == true
            ) {
              showEmptySearch = true;
            }
          })
          .map((props: any) => {
            return (
              <div className="items_container-shops" key={props.referencia}>
                <div className="items-information-shops-container">
                  <div className="items-information-shops__lot">
                    Numero de lote: {props.numero_lote}
                  </div>
                  <div className="items-information-shops__ref">
                    Referencia: {props.referencia}
                  </div>
                  <div className="items-information-shops__order">
                    Numero de orden: {props.numero_de_orden}
                  </div>
                  <div className="items-information-shops__amount">
                    Cantidad: {props.cantidad}
                  </div>
                  <div className="items-information-shops__timestamp">
                    Fecha: {props.timestamp.replace("T", " ").slice(0, 16)}
                  </div>
                  {/* <div className="items-information-shops__state">
                    Estado: {props.nombre_estado}
                  </div> */}
                </div>
                <div className="table_item-shops">
                  <img className="table_img-shops" src={props.nombre_imagen} />
                </div>
              </div>
            );
          })}
        {showEmptySearch && (
          <img
            className="notfoundImg-shops"
            src={notFoundImage}
            alt="Not Found"
          />
        )}
      </div>
    </div>
  );
};

export default InfoShopsInventory;
