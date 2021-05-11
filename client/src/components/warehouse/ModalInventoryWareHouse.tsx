import React, {useEffect, useState} from 'react';

import notFoundImage from '../../assets/Not Found.svg';
import './style/ModalInventoryWareHouse.css';

const ModalInvetoryBodega = ({modalContent, closeModal}: any) => {
  const handleClose = () => {
    closeModal();
  };

  const [searchTerm, setSearchTerm] = useState('');
  let iterator = 0;
  let enableEmpty = true;
  let showEmptySearch = false;

  const handlerSearch = (e: any) => {
    setSearchTerm(e);
    iterator = 0;
    enableEmpty = true;
    showEmptySearch = false;
  };

  return (
    <div className="container_table-bodega">
      <div className="table_title-bodega">Información</div>
      <div className="search-warehouse-container">
        <i className="gg-search"></i>
        <input
          type="search"
          placeholder="Buscar por código..."
          className="search-filter-design-warehouse"
          onChange={(e: any) => handlerSearch(e.target.value)}
        ></input>
      </div>
      <div className="table-header-container-warehouse">
        <div className="table_header-bodega">Insumo</div>
        <div className="table_header-bodega">Imagen</div>
      </div>
      <div className="scroll-modal-inventory">
        {modalContent
          .filter((val: any) => {
            iterator += 1;
            if (searchTerm === '') {
              return val;
            } else if (
              val.codigo
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
              <div className="items_container-bodega" key={props.codigo}>
                <div className="sub_items_container-bodega">
                  <div className="sub_sub_items_container-bodega">
                    <div className="table_item-bodega">
                      Código: {props.codigo}
                    </div>
                    <div className="table_item-bodega">
                      Descripción: {props.descripcion}
                    </div>
                    <div className="table_item-bodega">
                      Cantidad: {props.metros}
                    </div>
                  </div>
                  <div className="table_item-bodega">
                    <img
                      className="table_img-bodega"
                      src={props.nombre_imagen}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        {showEmptySearch && (
          <img
            className="notFoundImgWarehouse"
            src={notFoundImage}
            alt="Not found"
          />
        )}
      </div>
    </div>
  );
};

export default ModalInvetoryBodega;
