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
import InfoShopsInventory from "../components/shops/InfoShopsInventory";
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
  // DATABASE URLS
  const dbReferencesURL: string = baseURL + "api/references";
  const dbShopsInfoURL: string = baseURL + "api/shopsinformation";
  const dbProductsRequestURL: string =
    baseURL + "api/shopwarehouseproductsrequest";
  const dbDeliveryState: string = baseURL + "api/deliverystate";
  const dbActualInventory: string = baseURL + "api/getactualinventory";
  const dbUpdateReceivedState: string = baseURL + "api/updatereceivedstate";
  const dbRequestBetweenShops: string = baseURL + "api/requestsbetweenshops";

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
      const response: AxiosResponse | undefined = await query_post(
        dbRequestBetweenShops,
        data
      );
      console.log(response);
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

  const handleNavbarClick = (e: any) => {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    const location = document.querySelector(target).offsetTop;
    const scrollDiv = document.getElementById(
      'scroll-shops'
    ) as HTMLDivElement;

    scrollDiv.scrollTo(0, location - 108);
  };

  return (
    <div className="general-container-shops">
      <div className="navbar-shops">
        <h2 className="navbar-shops__h2">Tiendas</h2>
        <div className="navbar-shops-otpions">
          <a href="#makeReqShopsContainer" onClick={handleNavbarClick}>
            Peticion a bodega productos
          </a>
          <a
            href="#products-process-shops-section"
            onClick={handleNavbarClick}
          >
            Productos en procesos
          </a>
          <a
            href="#products-send-shops-section"
            onClick={handleNavbarClick}
          >
            Productos enviados
          </a>
        </div>
      </div>

      <div className="scroll-shops" id="scroll-shops">
        <div className="shops-request-wp">
          <div className="makeReqShopsContainer" id="makeReqShopsContainer"> 
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
            Productos En proceso
          </h3>
          <InfoShopsInventory arrayInformation={infoDeliveryState} />
        </div>

        <div
          className="products-send-shops-section"
          id="products-send-shops-section"
        >
          <h3 className="products-send-shops-section__h3">
            Productos Enviados
          </h3>
          <InfoShopsInventory arrayInformation={infoActualInventory} />
        </div>

        {/* <div className="productsContainer">
          {infoActualInventory.map((item: any, index: number) => {
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
              </div>
            );
          })}
        </div> */}
      </div>
      {/* <div className="select_box_center-reference">
        <div className="references-container">
          <div className="title">Seleccione la referencia:</div>
          <div className="select-container">
            <p className="selected-option-shops">Seleccionar</p>
            <ul className="options-container">
              {references.map((reference: IReference) => {
                return (
                  <li key={reference.referencia} className="option">
                    {reference.referencia}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="select_box_center-amount">
        <div className="title">Cantidad:</div>
        <input
          ref={refContainer}
          id="actualAmount"
          name="actualAmount"
          className="actualAmount"
          type="number"
          autoComplete="off"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <div className="select_box_center-reference">
          <div className="references-container">
            <div className="title">Seleccione la tienda:</div>
            <div className="select-container">
              <p className="selected-option-shopsinfo">Seleccionar</p>
              <ul className="options-container">
                {shops.map((shops: IShops) => {
                  return (
                    <li
                      key={shops.nombre_tienda}
                      data-id={shops.idTienda}
                      className="option-shopsinfo"
                    >
                      {shops.nombre_tienda}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="select_box_center-button">
        <button className="btn" type="button" onClick={productsRequest}>
          Enviar
        </button>
      </div> */}
      {/* <div className="makeReqShopsContainer">
        <div className="makeReqShopsContainer__dropdownReference">
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
        <div className="makeReqShopsContainer__dropdownShop">
          <FilterDropdown
            options={shops}
            id="idTienda"
            label="nombre_tienda"
            prompt="Seleccionar la tienda"
            value={value_origin_shop}
            onChange={(val: any) => set_value_origin_shop(val)}
          />
        </div>
        <div className="makeReqShopsContainer__dropdownShop">
          <FilterDropdown
            options={shops}
            id="idTienda"
            label="nombre_tienda"
            prompt="Seleccionar la tienda"
            value={value_destination_shop}
            onChange={(val: any) => set_value_destination_shop(val)}
          />
        </div>
        <div className="makeReqButtonContainer">
          <button
            className="btn"
            type="button"
            onClick={request_betweenshops_handler}
          >
            Enviar
          </button>
        </div>
      </div> */}

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
    </div>
  );
};

export default Shops;
