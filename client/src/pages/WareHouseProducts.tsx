import React, { useState, useEffect, useReducer, useRef } from "react";
import Axios, { AxiosResponse } from "axios";
import SuccessfulModalDressMaking from "../components/dressmaking/SuccessfulModalDressMaking";
// REDUCER
import { reducer } from "../components/dressmaking/ReducerDressMaking";
// import './style/DressMaking.css';
// import '../components/dressmaking/style/buttonStyle.css';
import { baseURL } from "../components/app/baseURL";
import notFoundImage from "../assets/Not Found.svg";
import Modal from "../components/Modal";
import completeImage from "../assets/complete.svg";
import errorImage from "../assets/error.svg";
import { StringLiteralLike, updateSourceFile } from "typescript";
import noDataImage from "../assets/no-data.svg";
import "./style/WareHouseProducts.css";
import ModalWarehouseProductsReq from "../components/warehouseProducts/ModalWarehouseProductsReq";

const WareHouseProducts = () => {
  //INTERFACES
  interface IWareHouseProducts {
    numero_lote: string;
    referencia: string;
    numero_de_orden: string;
    cantidad: string;
    timestamp: string;
    restante?: string;
    faltante?: string;
  }

  interface IShopRequests {
    numero_de_orden: number;
    referencia: number;
    cantidad: number;
    idTienda: number;
    timestamp: string;
    nombre_tienda: string;
    direccion: string;
  }

  // STATES STATEMENTS
  const [wareHouseProducts, setWareHouseProducts] = useState<
    IWareHouseProducts[]
  >([]);
  const [shopRequestInfo, setShopRequestInfo] = useState<any>([]);
  const [actualShopRequests, setActualShopRequest] = useState<IShopRequests[]>(
    []
  );
  const [reference, setReference] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isOpenModalReq, setIsOpenModalReq] = useState<boolean>(false);
  const [checkReqNumber, setCheckReqNumber] = useState<number>(0);
  const [indexModal, setIndexModal] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [toggleState, setToggleState] = useState(1);

  const dbWareHouseProducts: string = baseURL + "api/getwarehouseproducts";
  const dbShopsRequestProducts: string = baseURL + "api/shoprequestproducts";
  const dbAcceptShopRequest: string = baseURL + "api/acceptshoprequest";
  const dbActualShopsRequests: string = baseURL + "api/getactualshoprequests";
  const dbSaveDecision: string = baseURL + "api/savewarehouseproductsdecision";
  const dbPartialDelivery: string = baseURL + "api/updatepartialdelivery";

  let iterator = 0;
  let enableEmpty = true;
  let showEmptySearch = false;

  useEffect(() => {
    Axios.get(dbWareHouseProducts).then((response: AxiosResponse) => {
      setWareHouseProducts(response.data);
    });

    Axios.get(dbActualShopsRequests).then((response: AxiosResponse) => {
      setActualShopRequest(response.data);
    });
  }, []);

  const handlerShowInfo = (index: number) => {
    Axios.post(dbShopsRequestProducts, {
      reference: actualShopRequests[index].referencia,
      amount: actualShopRequests[index].cantidad,
    }).then((response: AxiosResponse) => {
      if (response.data[response.data.length - 1].faltante) {
        setShopRequestInfo(response.data);
        setCheckReqNumber(2);
        setIndexModal(index);
        setIsOpenModalReq(true);
      } else if (response.data === "NO EXISTE") {
        setCheckReqNumber(3);
        setIndexModal(index);
        setIsOpenModalReq(true);
      } else {
        setShopRequestInfo(response.data);
        setCheckReqNumber(1);
        setIndexModal(index);
        setIsOpenModalReq(true);
      }
    });
  };

  const handlerApprove = (payload: any) => {
    let index = payload;
    Axios.post(dbSaveDecision, {
      ...actualShopRequests[index],
      neededStock: shopRequestInfo,
      idDecision: 1,
    }).then((response: AxiosResponse): void => {
    });
    let filterResult = actualShopRequests.filter(
      (item: IShopRequests) =>
        item.numero_de_orden != actualShopRequests[index].numero_de_orden
    );
    setActualShopRequest(filterResult);
  };

  const handlerRefuse = (payload: any) => {
    let index = payload;
    Axios.post(dbSaveDecision, {
      ...actualShopRequests[index],
      idDecision: 0,
    }).then((response: AxiosResponse): void => {
      if (response.data === "SUCCESSFUL_SAVING") {
        let filterResult = actualShopRequests.filter(
          (item: IShopRequests) =>
            item.numero_de_orden !== actualShopRequests[index].numero_de_orden
        );
        setActualShopRequest(filterResult);
      } 
    });

  };

  const handlerPartialDelivery = (index: number) => {
    Axios.post(dbPartialDelivery, {
      ...actualShopRequests[index],
      neededStock: shopRequestInfo,
      idDecision: 1,
    }).then((response: AxiosResponse) => {
    });
  };

  const closeModal = () => {
    setIsOpenModalReq(false);
  };

  const handleNavbarClick = (e: any) => {
    e.preventDefault();
    const target = e.target.getAttribute("href");
    const location = document.querySelector(target).offsetTop;
    const scrollDiv = document.getElementById(
      "scroll-warehouseproducts"
    ) as HTMLDivElement;

    scrollDiv.scrollTo(0, location - 55);
  };

  const toggleTab = (index: number) => {
    setToggleState(index);
  };

  const handlerSearch = (e: any) => {
    setSearchTerm(e);
    iterator = 0;
    enableEmpty = true;
    showEmptySearch = false;
  };

  return (
    <div className="general-container-warehouseproducts">
      <div className="navbar-warehouseproducts">
        <h2 className="navbar-warehouseproducts__h2">Bodega Productos</h2>
        <div className="navbar-warehouseproducts-otpions">
          <div
            className={
              toggleState === 1
                ? "tabs-warehouseproducts active-tabs-warehouseproducts"
                : "tabs-warehouseproducts"
            }
            onClick={() => toggleTab(1)}
          >
            <a
              href="#products-warehouseproducts-section"
              onClick={handleNavbarClick}
            >
              Productos terminados
            </a>
          </div>
          <div
            className={
              toggleState === 2
                ? "tabs-warehouseproducts active-tabs-warehouseproducts"
                : "tabs-warehouseproducts"
            }
            onClick={() => toggleTab(2)}
          >
            <a
              href="#shops-request-warehouseproducts-section"
              onClick={handleNavbarClick}
            >
              Peticiones
            </a>
          </div>
        </div>
      </div>
      <div className="scroll-warehouseproducts" id="scroll-warehouseproducts">
        <div
          className="products-warehouseproducts-section"
          id="products-warehouseproducts-section"
        >
          <h3 className="products-finished-warehouseproducts-section__h3">
            Productos terminados
          </h3>
          <p className="products-finished-warehouseproducts-section__p">
            En este apartado se muestra el inventario de los productos
            terminados listos para ser enviado a las tiendas.
          </p>
          <div className="container_table-warehouseproducts">
            <div className="table_title-warehouseproducts ">Información</div>
            <div className="search-warehouseproducts-container">
              <i className="gg-search"></i>
              <input
                type="search"
                placeholder="Buscar por referencia..."
                className="search-filter-warehouseproducts"
                onChange={(e: any) => handlerSearch(e.target.value)}
              ></input>
            </div>
            <div className="sample-image-warehouseproducts-container">
              <div className="table_header-warehouseproducts-sample">
                Producto
              </div>
              <div className="table_header-warehouseproducts-img">Imagen</div>
            </div>
            <div className="scroll-modal-warehouseproducts">
              {wareHouseProducts
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
                  } else if (iterator == wareHouseProducts.length && enableEmpty == true) {
                    showEmptySearch = true;
                  }
                })
                .map((props: any) => {
                  return (
                    <div
                      className="items_container-warehouseproducts"
                      key={props.referencia}
                    >
                      <div className="items-information-wproducts-container">
                        <div className="items-information-wp-lot">
                          Numero de lote: {props.numero_lote}
                        </div>
                        <div className="items-information-wp-ref">
                          Referencia: {props.referencia}
                        </div>
                        <div className="items-information-wp-order">
                          Numero de orden: {props.numero_de_orden}
                        </div>
                        <div className="items-information-amount">
                          Cantidad: {props.cantidad}
                        </div>
                        <div className="items-information-timestamp">
                          Fecha:{" "}
                          {props.timestamp.replace("T", " ").slice(0, 16)}
                        </div>
                      </div>
                      <div className="table_item-warehouseproduct">
                        <img
                          className="table_img-warehouseproduct"
                          src={props.nombre_imagen}
                        />
                      </div>
                    </div>
                  );
                })}
              {showEmptySearch && (
                <img
                  className="notfoundImg-warehouseproducts"
                  src={notFoundImage}
                  alt="Not Found"
                />
              )}
            </div>
          </div>
        </div>
        <div
          className="shops-request-warehouseproducts-section"
          id="shops-request-warehouseproducts-section"
        >
          <h3 className="shops-request-warehouseproducts-section__h3">
            Peticiones
          </h3>
          <p className="shops-request-warehouseproducts-section__p">
            En este apartado se encuentran la peticiones realizadas por las
            tiendas que necesitan stock.
          </p>
          {actualShopRequests.length == 0 && (
            <>
              <div className="no-data-image-warehouseproducts-container">
                <img
                  src={noDataImage}
                  alt="no-data"
                  className="no-data-image-warehouseproducts-container__img"
                />
              </div>
              <p className="no-data-image-warehouseproducts-paragraph">
                Aún no hay peticiones
              </p>
            </>
          )}
          {actualShopRequests.length !== 0 && (
            <div className="shopsRequestContainer">
              {actualShopRequests.map((shop, index) => {
                return (
                  <div className="shopRequestCard">
                    <h4 className="shopRequestCard__h4">
                      Información de la petición
                    </h4>
                    <div className="shopRequestCard__order">
                      # de orden: {shop.numero_de_orden}
                    </div>
                    <div className="shopRequestCard__reference">
                      Referencia: {shop.referencia}
                    </div>
                    <div className="shopRequestCard__amount">
                      Cantidad: {shop.cantidad}
                    </div>
                    <div className="shopRequestCard__shop">
                      Tienda: {shop.nombre_tienda}
                    </div>
                    <div className="shopRequestCard_date">
                      Fecha: {shop.timestamp.replace("T", " ").slice(0, 16)}
                    </div>
                    <div className="shopRequestCard__address">
                      Dirección: {shop.direccion ? shop.direccion : "0"}
                    </div>
                    <button
                      className="btn shopRequestCard__deploy"
                      key={index}
                      data-index={index}
                      onClick={() => handlerShowInfo(index)}
                    >
                      Desplegar requerimientos
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <ModalWarehouseProductsReq
        isOpen={isOpenModalReq}
        closeModal={closeModal}
        infoReq={shopRequestInfo}
        checkReqNumber={checkReqNumber}
        handlerRefuse={handlerRefuse}
        handlerAccept={handlerApprove}
        handlerPartialDelivery={handlerPartialDelivery}
        index={indexModal}
      />
    </div>
  );
};

export default WareHouseProducts;
