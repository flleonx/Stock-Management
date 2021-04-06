import React, { useEffect, useState } from "react";

const ModalDesignInventory = ({ modalContent, closeModal }: any) => {
  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 40000);
  });
  const [searchTerm, setSearchTerm] = useState("");
  let iterator = 0;
  let enableEmpty = true;
  let showEmptySearch = false;

  const handlerSearch = (e: any) => {
    setSearchTerm(e);
    iterator = 0;
    enableEmpty = true;
    showEmptySearch = false;
  }

  return (
    <div className="container_table-design">
      <div className="table_title-design">Información</div>
      <input
        type="search"
        placeholder="Buscar..."
        className="search-filter-design"
        onChange={(e: any) => handlerSearch(e.target.value)}
      ></input>
      <div className="table_header-design">Muestra</div>
      <div className="table_header-design">Imagen</div>
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
              <div className="sub_items_container-design">
                <div className="sub_sub_items_container-design">
                  <div className="table_item-design-ref">
                    Referencia: {props.referencia}
                  </div>
                  <div className="table_item-design">Talla: {props.talla}</div>
                  <div className="table_item-design">
                    Descripción: {props.descripcion}
                  </div>
                  <div className="table_item-design">Color: {props.color}</div>
                </div>
                <div className="table_item-design">
                  <img className="table_img-design" src={props.nombre_imagen} />
                </div>
              </div>
            </div>
          );
        })}
        {showEmptySearch && (
          <img src="https://poptaim.com/wp-content/uploads/2020/05/S2_002-2-900x600.jpg"/>
        )}
    </div>
  );
};

export default ModalDesignInventory;
