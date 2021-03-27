import React, {useEffect} from 'react';

const ModalInvetoryBodega = ({modalContent, closeModal}: any) => {
  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 40000);
  });

  return (
    <div className="container_table-bodega">
      <div className="table_title-bodega">Información</div>
      <div className="table_header-bodega">Insumo</div>
      <div className="table_header-bodega">Imagen</div>
      {modalContent.map((props: any) => {
        return (
          <div className="items_container-bodega" key={props.codigo}>
            <div className="sub_items_container-bodega">
              <div className="sub_sub_items_container-bodega">
                <div className="table_item-bodega">Código: {props.codigo}</div>
                <div className="table_item-bodega">
                  Descripción: {props.descripcion}
                </div>
                <div className="table_item-bodega">
                  Cantidad: {props.metros} metros
                </div>
              </div>
              <div className="table_item-bodega">
                <img className="table_img-bodega" src={props.nombre_imagen} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ModalInvetoryBodega;
