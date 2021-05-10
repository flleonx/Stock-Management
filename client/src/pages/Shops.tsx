import React, { useState, useEffect, useReducer, useRef } from "react";
import Axios, { AxiosResponse } from "axios";
import SuccessfulModalDressMaking from "../components/dressmaking/SuccessfulModalDressMaking";
// REDUCER
// import {reducer} from '../components/dressmaking/ReducerDressMaking';
import "./style/Shops.css";
// import '../components/dressmaking/style/buttonStyle.css';
import { baseURL } from "../components/app/baseURL";
import FilterDropdown from "../components/FilterDropdown";
import Modal from "../components/Modal";
import completeImage from "../assets/complete.svg";
import errorImage from "../assets/error.svg";
import noDataImage from "../assets/no-data.svg";
import InfoShopsInventory from "../components/shops/InfoShopsInventory";
import ModalShopsReq from "../components/shops/ModalShopsReq";
import { StringLiteralLike, updateSourceFile } from "typescript";

const reducer = (state: any, action: any) => {
  if (action.type === "SUCCESSFUL_REQUEST") {
    return {
      ...state,
      modalContent: "Petición realizada",
      imgCheckNumber: 1,
      isModalOpen: true,
    };
  }
  if (action.type === "WRONG_INPUT") {
    return {
      ...state,
      modalContent: "Error: Digite los campos bien",
      isModalOpen: true,
      imgCheckNumber: 2,
    };
  }
  if (action.type === "CLOSE_MODAL") {
    return {
      ...state,
      isModalOpen: false,
      imgCheckNumber: 0,
      modalContent: "",
    };
  }
  return {
    ...state,
    isModalOpen: false,
    modalContent: "",
    imgCheckNumber: 0,
  };
};

const defaultState: any = {
  isModalOpen: false,
  modalContent: "",
  imgCheckNumber: 0,
};

const Shops = () => {
  interface IReference {
    referencia: number;
    id_talla: number;
    descripcion: string;
    color: string;
    nombre_imagen: string;
    codigoycantidad: string;
  }
  interface IShops {
    idTienda: number;
    nombre_tienda: string;
    direccion: string;
  }

  const [references, setReferences] = useState<IReference[]>([]);
  const [shops, setShops] = useState<IShops[]>([]);
  const [valueReferenceSelect, setValueReferenceSelect] = useState<any>(null);
  const [valueShopSelect, setValueShopSelect] = useState<any>(null);
  const [amount, setAmount] = useState<string>("");
  const [selectedReference, setSelectedReference] = useState<string>("");
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [approvedRequests, setApprovedRequests] = useState<any>([]);
  const [numberInput, setNumberInput] = useState<string>("");
  const [infoDeliveryState, setInfoDeliveryState] = useState<any>([]);
  const [infoActualInventory, setInfoActualInventory] = useState<any>([]);
  const [requiredStock, setRequiredStock] = useState<any>([]);
  const [infoRequestsBetweenShops, setInfoRequestsBetweenShops] = useState<any>(
    []
  );
  const [checkReqNumber, setCheckReqNumber] = useState<number>(0);
  const [indexModal, setIndexModal] = useState<number>(0);
  const [isOpenModalReq, setIsOpenModalReq] = useState<boolean>(false);
  const [auxiliar, setAuxiliar] = useState<any>([]);
  const [state, dispatch] = useReducer(reducer, defaultState);
  const refContainer: any = useRef(null);

  // REQUEST BETWEEN SHOPS useStates
  const [value_reference_request, set_value_reference_request] = useState<any>(
    null
  );
  const [amount_request, set_amount_request] = useState<string>("");
  const [value_origin_shop, set_value_origin_shop] = useState<any>(null);
  const [value_destination_shop, set_value_destination_shop] = useState<any>(
    null
  );
  const [toggleState, setToggleState] = useState(1);
  // DATABASE URLS
  const dbReferencesURL: string = baseURL + "api/references";
  const dbShopsInfoURL: string = baseURL + "api/shopsinformation";
  const dbProductsRequestURL: string =
    baseURL + "api/shopwarehouseproductsrequest";
  const dbDeliveryState: string = baseURL + "api/deliverystate";
  const dbActualInventory: string = baseURL + "api/getactualinventory";
  const dbActualRequestsBetweenShops: string =
    baseURL + "api/getactualrequestbetweenshops";
  const dbUpdateReceivedState: string = baseURL + "api/updatereceivedstate";
  const dbRequestBetweenShops: string = baseURL + "api/requestsbetweenshops";
  const dbDecisionBetweenShops: string = baseURL + "api/decisionbetweenshops";
  const dbSaveNewShopRequest: string = baseURL + "api/save_newshop_request";

  useEffect(() => {
    Axios.get(dbReferencesURL).then((response: AxiosResponse) => {
      setReferences(response.data);
      // triggerListeners('.selected-option-shops', '.option', 0);
    });

    Axios.get(dbShopsInfoURL).then((response: AxiosResponse) => {
      setShops(response.data);
      // triggerListeners('.selected-option-shopsinfo', '.option-shopsinfo', 1);
    });

    Axios.get(dbActualInventory).then((response: AxiosResponse) => {
      setInfoActualInventory(response.data);
    });

    Axios.get(dbDeliveryState).then((response: AxiosResponse) => {
      setInfoDeliveryState(response.data);
      // console.log(response.data);
    });

    Axios.get(dbActualRequestsBetweenShops).then((response: AxiosResponse) => {
      setInfoRequestsBetweenShops(response.data);
      console.log(response.data);
    });

    const triggerListeners = (
      class1: string,
      class2: string,
      setNumber: number
    ) => {
      var selectedOption: any = document.querySelector(class1);
      var options: any = document.querySelectorAll(class2);

      selectedOption.addEventListener("click", () => {
        selectedOption.parentElement.classList.toggle("active");
      });

      options.forEach((option: any) => {
        option.addEventListener("click", () => {
          setTimeout(() => {
            selectedOption.innerHTML = option.innerHTML;
            // SET CURRENT REFERENCE VALUE
            // 0 ==> Reference
            if (setNumber === 0) {
              setSelectedReference(option.innerHTML);
              // 1 ==> Shop id
            } else if (setNumber === 1) {
              setSelectedShop(option.getAttribute("data-id"));
            }
          }, 300);

          selectedOption.parentElement.classList.remove("active");
        });
      });
    };
  }, []);

  // GENERAL DATABASE CHECK
  const check_existing_value = async (check_case: number, payload: string) => {
    try {
      const response = await Axios.post(baseURL + "api/check_existing_value", {
        check_case,
        payload,
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };
  // CHECK THE TYPE DUE TO THE SEARCH DROPDOWN
  const check_type_case = (case_parameter: any, case_attribute: string) => {
    let result = "";
    if (typeof case_parameter === "object" && case_parameter !== null) {
      result = case_parameter[case_attribute].toString();
      return result;
    } else if (typeof case_parameter === "string" && case_parameter !== null) {
      result = case_parameter;
      return result;
    }
    return result;
  };

  const productsRequest = async () => {
    let valueReferenceSelected: string = check_type_case(
      valueReferenceSelect,
      "referencia"
    );
    let valueShopSelected: string = check_type_case(
      valueShopSelect,
      "idTienda"
    );
    let isReferenceExist: boolean = false;
    let isShopExist: boolean = false;

    const correctAmount = parseFloat(amount);

    // CHECK IN DATABASE ==> return boolean
    isReferenceExist = await check_existing_value(0, valueReferenceSelected); // O: referencia
    isShopExist = await check_existing_value(1, valueShopSelected); // 1: idTienda
    console.log(amount, valueReferenceSelected, valueShopSelected);

    console.log(valueShopSelected);

    let enableInput = valueShopSelected !== "";
    let enableInput2 = valueReferenceSelected !== "";
    if (
      Number.isInteger(correctAmount) &&
      correctAmount > 0 &&
      enableInput &&
      enableInput2 &&
      isShopExist &&
      isReferenceExist
    ) {
      Axios.post(dbProductsRequestURL, {
        actualAmount: amount,
        referenceSelection: valueReferenceSelected,
        idShop: valueShopSelected,
      }).then((response: AxiosResponse): void => {
        console.log(response.data);
        dispatch({ type: "SUCCESSFUL_REQUEST" });
        setValueReferenceSelect(null);
        setValueShopSelect(null);
        refContainer.current.value = "";
      });
    } else {
      dispatch({ type: "WRONG_INPUT" });
      refContainer.current.value = "";
    }
  };

  const closeModal = () => {
    setIsOpenModalReq(false);
    dispatch({ type: "CLOSE_MODAL" });
  };

  const handlerReceived = (index: number) => {
    Axios.post(dbUpdateReceivedState, infoDeliveryState[index]).then(
      (response: AxiosResponse) => {
        setInfoDeliveryState(response.data[0]);
        setInfoActualInventory(response.data[1]);
      }
    );
  };

  const query_post = async (url: string, payload: any) => {
    try {
      const response: AxiosResponse = await Axios.post(url, payload);
      console.log("RESPONSE", response.data);
      return response.data;
    } catch (err) {
      console.error("There is an error", err);
      return;
    }
  };

  const request_betweenshops_handler = async () => {
    let valueReferenceSelected: string = check_type_case(
      value_reference_request,
      "referencia"
    );
    let valueOriginShopSelected: string = check_type_case(
      value_origin_shop,
      "idTienda"
    );
    let valueDestinationShopSelected: string = check_type_case(
      value_destination_shop,
      "idTienda"
    );
    let isReferenceExist: boolean = false;
    let isOShopExist: boolean = false; //Origin
    let isDShopExist: boolean = false; //Destination
    const correctAmount = parseFloat(amount_request);

    // CHECK IN DATABASE ==> return boolean
    isReferenceExist = await check_existing_value(0, valueReferenceSelected); // O: referencia
    isOShopExist = await check_existing_value(1, valueOriginShopSelected); // 1: idTienda
    isDShopExist = await check_existing_value(1, valueDestinationShopSelected); // 1: idTienda

    let enableInput = valueReferenceSelected !== "" && isReferenceExist;
    let enableInput2 = valueOriginShopSelected !== "" && isOShopExist;
    let enableInput3 = valueDestinationShopSelected !== "" && isDShopExist;

    if (
      Number.isInteger(correctAmount) &&
      correctAmount > 0 &&
      enableInput &&
      enableInput2 &&
      enableInput3
    ) {
      const data = {
        cantidad: amount_request,
        referencia: valueReferenceSelected,
        tienda_origen: valueOriginShopSelected,
        tienda_destino: valueDestinationShopSelected,
      };
      const response: AxiosResponse[] = await query_post(
        dbSaveNewShopRequest,
        data
      );
    } else {
      // dispatch({ type: "WRONG_INPUT" });
      // refContainer.current.value = "";
      console.log("WRONG");
    }

    // const payload = {
    //   referencia: value_reference_request,
    //   cantidad: amount_request,
    //   tienda_origen: value_origin_shop,
    //   tienda_destino: value_destination_shop,
    // };
    // Axios.post(dbRequestBetweenShops).then((response: AxiosResponse) => {
    //   console.log(response.data);
    // });
  };

  const handler_required_stock = async (index: number) => {
    console.log(infoRequestsBetweenShops[index]);
    const actualTarget = infoRequestsBetweenShops[index];
    const response: AxiosResponse[] = await query_post(dbRequestBetweenShops, {
      ...infoRequestsBetweenShops[index],
    });
    console.log(response[0] !== null);
    console.log(response);
    setAuxiliar([
      actualTarget.cantidad,
      actualTarget.tienda_destino,
      actualTarget.numero_peticion,
    ]);
    setIndexModal(index);
    setIsOpenModalReq(true);
    if (response[0] !== null) {
      const required_stock_size: number = response.length;
      const amount_number: number = parseInt(auxiliar[0]);
      if (required_stock_size < amount_number) {
        console.log("FALTAN", amount_number - required_stock_size);
        setCheckReqNumber(2);
      } else {
        console.log("TODO BIEN");
        setCheckReqNumber(1);
      }
    } else {
      console.log("NO HAY EXISTENCIAS");
      setCheckReqNumber(3);
    }
  };

  const handler_final_decision = async (id_decision: number) => {
    console.log("MANEJO DECISION", id_decision);
    if (id_decision === 1) {
      // ACCEPT
      const response_decision_state:
        | AxiosResponse
        | undefined = await query_post(dbDecisionBetweenShops, {
        numeros_de_entrada: requiredStock,
        data: {
          tienda_destino: auxiliar[1],
          numero_peticion: auxiliar[2],
          id_decision,
        },
      });
      console.log(response_decision_state);
    } else if (id_decision === 0) {
      // REFUSE
      const response_decision_state:
        | AxiosResponse
        | undefined = await query_post(dbDecisionBetweenShops, {
        data: { numero_peticion: auxiliar[2], id_decision },
      });
      console.log(response_decision_state);
    }
  };

  const handlerShowInfo = (index: any) => {};

  const handleNavbarClick = (e: any) => {
    e.preventDefault();
    const target = e.target.getAttribute("href");
    const location = document.querySelector(target).offsetTop;
    const scrollDiv = document.getElementById("scroll-shops") as HTMLDivElement;

    scrollDiv.scrollTo(0, location - 55);
  };

  const toggleTab = (index: number) => {
    setToggleState(index);
  };

  return (
    <div className="general-container-shops">
      <div className="navbar-shops">
        <h2 className="navbar-shops__h2">Tiendas</h2>
        <div className="navbar-shops-otpions">
          <div
            className={
              toggleState === 1 ? "tabs-shops active-tabs-shops" : "tabs-shops"
            }
            onClick={() => toggleTab(1)}
          >
            <a href="#shops-request-wp" onClick={handleNavbarClick}>
              Peticion a bodega productos
            </a>
          </div>
          <div
            className={
              toggleState === 2 ? "tabs-shops active-tabs-shops" : "tabs-shops"
            }
            onClick={() => toggleTab(2)}
          >
            <a
              href="#products-process-shops-section"
              onClick={handleNavbarClick}
            >
              Productos en procesos
            </a>
          </div>
          <div
            className={
              toggleState === 3 ? "tabs-shops active-tabs-shops" : "tabs-shops"
            }
            onClick={() => toggleTab(3)}
          >
            <a href="#products-send-shops-section" onClick={handleNavbarClick}>
              Productos enviados
            </a>
          </div>
          <div
            className={
              toggleState === 4 ? "tabs-shops active-tabs-shops" : "tabs-shops"
            }
            onClick={() => toggleTab(4)}
          >
            <a href="#reqs-between-shops-section" onClick={handleNavbarClick}>
              Petición entre tiendas
            </a>
          </div>
          <div
            className={
              toggleState === 5 ? "tabs-shops active-tabs-shops" : "tabs-shops"
            }
            onClick={() => toggleTab(5)}
          >
            <a
              href="#active-req-between-shops-section"
              onClick={handleNavbarClick}
            >
              Peticiones activas entre tiendas
            </a>
          </div>
        </div>
      </div>

      <div className="scroll-shops" id="scroll-shops">
        <div className="shops-request-wp" id="shops-request-wp">
          <div className="makeReqShopsContainer">
            <h4>Enviar peticiones a Bodega Producto</h4>
            <div className="makeReqShopsContainer__dropdownReference">
              <FilterDropdown
                options={references}
                id="referencia"
                label="referencia"
                prompt="Seleccionar referencia"
                value={valueReferenceSelect}
                onChange={(val: any) => setValueReferenceSelect(val)}
              />
            </div>
            <input
              ref={refContainer}
              id="actualAmount"
              name="actualAmount"
              className="actualAmount"
              placeholder="Digite la cantidad"
              type="number"
              autoComplete="off"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
            <div className="makeReqShopsContainer__dropdownShop">
              <FilterDropdown
                options={shops}
                id="idTienda"
                label="nombre_tienda"
                prompt="Seleccionar tienda"
                value={valueShopSelect}
                onChange={(val: any) => setValueShopSelect(val)}
              />
            </div>
            {/* <div className="makeReqButtonContainer"> */}
            <button
              className="btn makeReqButtonContainer"
              type="button"
              onClick={productsRequest}
            >
              Enviar
            </button>
            {/* </div> */}
          </div>

          <div className="information-shop-request-wp-container">
            <h2 className="information-shop-request-wp-container__h2">
              Enviar petición a Bodega Productos
            </h2>
            <p className="information-shop-request-wp-container__p">
              ¿Necesitas stock en alguna tienda? Entonces envía una petición a
              Bodega Productos para enviar productos a una tienda en concreto.
              Solo escoge la referencia del producto que necesitas, digita
              cuantos deseas, selecciona la tienda de destino y preciona el
              botón de enviar. Así de sencillo :)
            </p>
          </div>
        </div>

        {/* <div className="productsContainer">
          {infoDeliveryState.map((item: any, index: number) => {
            return (
              <div className="productCard">
                <h4 className="productCard__h4"> Información del producto</h4>
                <div className="productCard__lot">
                  Numero de Lote: {item.numero_lote}
                </div>
                <div className="productCard__reference">
                  Referencia: {item.referencia}
                </div>
                <div className="productCard__Order">
                  # de orden: {item.numero_de_orden}
                </div>
                <div className="productCard__amount">
                  Cantidad: {item.cantidadTotal}
                </div>
                <div className="productCard__date">
                  Fecha: {item.timestamp.replace("T", " ").slice(0, 16)}
                </div>
                <div className="productCard__date">
                  Estado: {item.nombre_estado}
                </div>
                <div className="makeReqButtonContainer">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => handlerReceived(index)}
                  >
                    Confirmar recibido
                  </button>
                </div>
              </div>
            );
          })}
        </div> */}

        <div
          className="products-process-shops-section"
          id="products-process-shops-section"
        >
          <h3 className="products-finished-warehouseproducts-section__h3">
            Inventario tiendas
          </h3>
          <p className="products-finished-warehouseproducts-section__p">
            En este apartado se encuentra el inventario de todas las tiendas.
          </p>
          <InfoShopsInventory
            arrayInformation={infoActualInventory}
            checkNumber={0}
          />
        </div>

        <div
          className="products-send-shops-section"
          id="products-send-shops-section"
        >
          <h3 className="products-send-shops-section__h3">
            Productos en envio
          </h3>
          <p className="products-send-shops-section__p">
            Aquí se encuentran los productos que están en camino hacia una o
            varias tiendas. Por favor, informe que ya ha llegado el pedido
            presionando el botón 'Confirmar recibido'.
          </p>
          <InfoShopsInventory
            arrayInformation={infoDeliveryState}
            checkNumber={1}
            receivedFunction={handlerReceived}
          />
        </div>

        <div
          className="reqs-between-shops-section"
          id="reqs-between-shops-section"
        >
          <div className="reqs-between-shops">
            <h4>Enviar petición entre tiendas</h4>
            <div className="reqs-between-shops__dropdownReference">
              <FilterDropdown
                options={references}
                id="referencia"
                label="referencia"
                prompt="Seleccionar referencia"
                value={value_reference_request}
                onChange={(val: any) => set_value_reference_request(val)}
              />
            </div>
            <input
              ref={refContainer}
              id="actualAmount"
              name="actualAmount"
              className="actualAmount"
              placeholder="Digite la cantidad"
              type="number"
              autoComplete="off"
              onChange={(e) => {
                set_amount_request(e.target.value);
              }}
            />
            <div className="reqs-between-shops__dropdownShop">
              <FilterDropdown
                options={shops}
                id="idTienda"
                label="nombre_tienda"
                prompt="Seleccionar la tienda origen"
                value={value_origin_shop}
                onChange={(val: any) => set_value_origin_shop(val)}
              />
            </div>
            <div className="reqs-between-shops__dropdownShop">
              <FilterDropdown
                options={shops}
                id="idTienda"
                label="nombre_tienda"
                prompt="Seleccionar la tienda de destino"
                value={value_destination_shop}
                onChange={(val: any) => set_value_destination_shop(val)}
              />
            </div>
            <div className="reqs-between-shops-buttonContainer">
              <button
                className="btn"
                type="button"
                onClick={request_betweenshops_handler}
              >
                Enviar
              </button>
            </div>
          </div>

          <div className="information-between-shops-container">
            <h2 className="information-between-shops-container__h2">
              Enviar petición entre tiendas
            </h2>
            <p className="information-between-shops-container__p">
              ¿Necesitas urgente un producto que solicita un cliente y está en
              otra tienda? Entonces envía una petición entre tiendas. Solo
              escoge la referencia del producto que necesitas, digita la
              cantidad que requieres, escoge la tienda donde se encuentra el
              producto, luego escoge la tienda de destino y presiona el botón
              enviar. Así de fácil :)
            </p>
          </div>
        </div>

        <div
          className="active-req-between-shops-section"
          id="active-req-between-shops-section"
        >
          <h3 className="active-req-between-shops-section__h3">
            Peticiones activas entre tiendas
          </h3>
          <p className="active-req-between-shops-section__p">
            En este apartado se encuentran la peticiones de las tiendas que han
            solicitado productos de otras tiendas.
          </p>
          {infoRequestsBetweenShops.length == 0 && (
            <>
              <div className="no-data-image-shops-container">
                <img
                  src={noDataImage}
                  alt="no-data"
                  className="no-data-image-shops-container__img"
                />
              </div>
              <p className="no-data-image-shops-paragraph">
                Aún no hay peticiones
              </p>
            </>
          )}
          {infoRequestsBetweenShops.length !== 0 && (
            <div className="activeRequestBetweenShopsContainer">
              {infoRequestsBetweenShops.map((shop: any, index: any) => {
                return (
                  <div className="activeRequestBetweenShopsCard">
                    <h4 className="activeRequestBetweenShopsCard__h4">
                      Información de la petición
                    </h4>
                    <div className="activeRequestBetweenShopsCard__order">
                      # de petición: {shop.numero_peticion}
                    </div>
                    <div className="activeRequestBetweenShopsCard__reference">
                      Referencia: {shop.referencia}
                    </div>
                    <div className="activeRequestBetweenShopsCard__amount">
                      Cantidad: {shop.cantidad}
                    </div>
                    <div className="activeRequestBetweenShopsCard__shop">
                      Tienda Origen: {shop.tienda_origen_nombre}
                    </div>
                    <div className="activeRequestBetweenShopsCard__shop">
                      Tienda Destino: {shop.tienda_destino_nombre}
                    </div>
                    <div className="activeRequestBetweenShopsCard__date">
                      Fecha: {shop.timestamp.replace("T", " ").slice(0, 16)}
                    </div>
                    <button
                      className="btn activeRequestBetweenShopsCard__deploy"
                      key={index}
                      data-index={index}
                      // onClick={() => setIsOpenModalReq(true)}
                      onClick={() => handler_required_stock(index)}
                    >
                      Desplegar requerimientos
                    </button>
                    {/* <button
                      className="btn shopRequestCard__deploy"
                      key={index}
                      data-index={index}
                      // onClick={() => setIsOpenModalReq(true)}
                      onClick={() => handler_final_decision(0)}
                    >
                      Rechazar
                    </button>
                    <button
                      className="btn shopRequestCard__deploy"
                      key={index}
                      data-index={index}
                      // onClick={() => setIsOpenModalReq(true)}
                      onClick={() => handler_final_decision(1)}
                    >
                      Aceptar
                    </button> */}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* <div className="shopsRequestContainer">
          {infoRequestsBetweenShops.map((shop: any, index: number) => {
            return (
              <div className="shopRequestCard">
                <h4 className="shopRequestCard__h4">
                  Información de la petición
                </h4>
                <div className="shopRequestCard__order">
                  # de petición: {shop.numero_peticion}
                </div>
                <div className="shopRequestCard__reference">
                  Referencia: {shop.referencia}
                </div>
                <div className="shopRequestCard__amount">
                  Cantidad: {shop.cantidad}
                </div>
                <div className="shopRequestCard__shop">
                  Tienda Origen: {shop.tienda_origen_nombre}
                </div>
                <div className="shopRequestCard__shop">
                  Tienda Destino: {shop.tienda_destino_nombre}
                </div>
                <div className="shopRequestCard_date">
                  Fecha: {shop.timestamp.replace("T", " ").slice(0, 16)}
                </div>
                <button
                  className="btn shopRequestCard__deploy"
                  key={index}
                  data-index={index}
                  // onClick={() => setIsOpenModalReq(true)}
                  onClick={() => handler_required_stock(index)}
                >
                  Desplegar requerimientos
                </button>
                <button
                  className="btn shopRequestCard__deploy"
                  key={index}
                  data-index={index}
                  // onClick={() => setIsOpenModalReq(true)}
                  onClick={() => handler_final_decision(0)}
                >
                  Rechazar
                </button>
                <button
                  className="btn shopRequestCard__deploy"
                  key={index}
                  data-index={index}
                  // onClick={() => setIsOpenModalReq(true)}
                  onClick={() => handler_final_decision(1)}
                >
                  Aceptar
                </button>
              </div>
            );
          })}
        </div> */}
      </div>

      <Modal isOpen={state.isModalOpen} closeModal={closeModal}>
        <h1 className="modalWarehouseh1">{state.modalContent}</h1>
        {state.imgCheckNumber === 1 && (
          <img
            className="modalWarehouseImg"
            src={completeImage}
            alt="modalImg"
          />
        )}
        {state.imgCheckNumber === 2 && (
          <img className="modalWarehouseImg" src={errorImage} alt="modalImg" />
        )}
      </Modal>

      <ModalShopsReq
        isOpen={isOpenModalReq}
        closeModal={closeModal}
        checkReqNumber={checkReqNumber}
        indexReq={indexModal}
        handleDecision={handler_final_decision}
      />
    </div>
  );
};

export default Shops;
