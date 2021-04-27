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
  const dbReferencesURL: string = baseURL + "api/references";
  const dbShopsInfoURL: string = baseURL + "api/shopsinformation";
  const dbProductsRequestURL: string =
    baseURL + "api/shopwarehouseproductsrequest";
  const dbDeliveryState: string = baseURL + "api/deliverystate";
  const dbActualInventory: string = baseURL + "api/getactualinventory";
  const dbUpdateReceivedState: string = baseURL + "api/updatereceivedstate";

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

  const productsRequest = () => {
    let valueReferenceSelected = "";
    let valueShopSelected = "";
    let isReferenceExist = 0;
    let isShopExist = 0;

    const correctAmount = parseFloat(amount);
    if (valueReferenceSelect === null) {
      valueReferenceSelected = "";
    } else if (typeof valueReferenceSelect === "object") {
      valueReferenceSelected = valueReferenceSelect.referencia.toString();
    } else if (typeof valueReferenceSelect === "string") {
      valueReferenceSelected = valueReferenceSelect;
    }

    references.map((val: any) => {
      if (val.referencia.toString() === valueReferenceSelected) {
        isReferenceExist += 1;
        return isReferenceExist;
      } else {
        return isReferenceExist;
      }
    });

    if (valueShopSelect === null) {
      valueShopSelected = "";
    } else if (typeof valueShopSelect === "object") {
      valueShopSelected = valueShopSelect.idTienda;
    } else if (typeof valueShopSelect === "string") {
      valueShopSelected = valueShopSelect;
    }

    shops.map((val: any) => {
      if (val.idTienda === valueShopSelected) {
        isShopExist += 1;
        return isShopExist;
      } else {
        return isShopExist;
      }
    });

    console.log(valueShopSelected);

    let enableInput = valueShopSelected !== "";
    let enableInput2 = valueReferenceSelected !== "";
    if (
      Number.isInteger(correctAmount) &&
      correctAmount > 0 &&
      enableInput &&
      enableInput2
    ) {
      if (isShopExist === 1) {
        if (isReferenceExist === 1) {
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
        }
      }
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
        setInfoDeliveryState(response.data[0])
        setInfoActualInventory(response.data[1])
      }
    );
  };

  return (
    <div className="general-container-shops">
      <h2 className="general-container-shops__h2">Tiendas</h2>
      <p className="general-container-shops__p">
        Aquí puedes hacer peticiones de productos ya producidos que se
        encuentren en Bodega productos.
      </p>
      <div className="makeReqShopsContainer">
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
            prompt="Seleccionar la tienda"
            value={valueShopSelect}
            onChange={(val: any) => setValueShopSelect(val)}
          />
        </div>
        <div className="makeReqButtonContainer">
          <button className="btn" type="button" onClick={productsRequest}>
            Enviar
          </button>
        </div>
      </div>

      <div className="productsContainer">
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
      </div>

      <div className="productsContainer">
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
