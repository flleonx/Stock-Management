import React, {useEffect} from 'react';

const ModalDesignInventory = ({modalContent, closeModal}: any) => {
  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 40000);
  });

  return (
    <div className="container_table-design">
      <div className="table_title-design">Información</div>
      <div className="table_header-design">Muestra</div>
      <div className="table_header-design">Imagen</div>
      {modalContent.map((props: any) => {
        return (
          <div className="items_container-design" key={props.referencia}>
            <div className="sub_items_container-design">
              <div className="sub_sub_items_container-design">
                <div className="table_item-design">
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
    </div>
  );
};

export default ModalDesignInventory;
