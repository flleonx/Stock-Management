import React, { useState, useEffect, useReducer, useRef } from "react";
import Axios, { AxiosResponse } from "axios";
import SuccessfulModalDressMaking from "../components/dressmaking/SuccessfulModalDressMaking";
// REDUCER
import { reducer } from "../components/dressmaking/ReducerDressMaking";
import "./style/Shops.css";
// import '../components/dressmaking/style/buttonStyle.css';
import { baseURL } from "../components/app/baseURL";
import Modal from "../components/Modal";
import completeImage from "../assets/complete.svg";
import errorImage from "../assets/error.svg";
import { StringLiteralLike, updateSourceFile } from "typescript";

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
  const [amount, setAmount] = useState<string>("");
  const [selectedReference, setSelectedReference] = useState<string>("");
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [approvedRequests, setApprovedRequests] = useState<any>([]);
  const [numberInput, setNumberInput] = useState<string>("");
  const refContainer: any = useRef(null);
  const dbReferencesURL: string = baseURL + "api/references";
  const dbShopsInfoURL: string = baseURL + "api/shopsinformation";
  const dbProductsRequestURL: string =
    baseURL + "api/shopwarehouseproductsrequest";
  useEffect(() => {
    Axios.get(dbReferencesURL).then((response: AxiosResponse) => {
      setReferences(response.data);
      triggerListeners(".selected-option-shops", ".option", 0);
    });

    Axios.get(dbShopsInfoURL).then((response: AxiosResponse) => {
      setShops(response.data);
      triggerListeners(".selected-option-shopsinfo", ".option-shopsinfo", 1);
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
    const correctAmount = parseFloat(amount);
    const inputOptionReference = document.querySelector(
      ".selected-option-shops"
    );
    const inputOptionShop = document.querySelector(
      ".selected-option-shopsinfo"
    );
    let enableInput = inputOptionReference?.innerHTML !== "Seleccionar";
    let enableInput2 = inputOptionShop?.innerHTML !== "Seleccionar";
    if (
      Number.isInteger(correctAmount) &&
      correctAmount > 0 &&
      enableInput &&
      enableInput2
    ) {
      Axios.post(dbProductsRequestURL, {
        actualAmount: amount,
        referenceSelection: selectedReference,
        idShop: selectedShop
      }).then((response: AxiosResponse): void => {
        console.log(response.data);
      });
    } else {
      refContainer.current.value = "";
    }
  };

  return (
    <div className="external_options_container">
      <div className="options_container">
        <div className="select_box_center-reference">
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
        {/* <label htmlFor='acualAmout' className="amount_label">Cantidad: </label> */}
        <div className="select_box_center-button">
          <button className="btn" type="button" onClick={productsRequest}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shops;
