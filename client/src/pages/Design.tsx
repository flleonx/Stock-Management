import React, { useState, useEffect, useReducer } from "react";
import Axios, { AxiosResponse } from "axios";
import { withRouter } from "react-router-dom";
import ModalDesign from "../components/design/ModalDesign";
import { reducer } from "../components/design/ReducerDesign";
import "./style/Design.css";

interface ISupplyInformation {
  supplyCode: string;
  supplyAmount: string;
}

interface IWareHouseSupplies {
  codigo: number;
  color: string;
  metros: number;
  cantidad: number;
  descripcion: string;
  nombre_imagen: string;
  timestamp: string;
}

const defaultState: any = {
  modalContent: [],
  isModalOpen: false,
  checkNumber: 0,
};

const Design = () => {
  const dbWareHouseCodesURL: string =
    "http://localhost:10000/api/warehousecodes";
  const dbSaveNewReference: string =
    "http://localhost:10000/api/savenewreference";
  const [dBWareHouseSupplies, setdBWareHouseSupplies] = useState<
    IWareHouseSupplies[]
  >([]);
  const [addReference, setAddReference] = useState<string>("");
  const [addSize, setAddSize] = useState<string>("");
  const [addDescription, setAddDescription] = useState<string>("");
  const [addColor, setAddColor] = useState<string>("");
  const [addImageName, setAddImageName] = useState<string>("");
  const [inputAmount, setInputAmount] = useState<string>("");
  const [addedInformation, setAddedInformation] = useState<
    ISupplyInformation[]
  >([]);
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    Axios.get(dbWareHouseCodesURL).then((response: AxiosResponse) => {
      setdBWareHouseSupplies(response.data);
      console.log(response.data);
      triggerListeners();
    });
    const triggerListeners = () => {
      var selectedOption: any = document.querySelector(".selected-option");
      var options: any = document.querySelectorAll(".option");

      selectedOption.addEventListener("click", () => {
        selectedOption.parentElement.classList.toggle("active");
      });

      options.forEach((option: any) => {
        option.addEventListener("click", () => {
          setTimeout(() => {
            selectedOption.innerHTML = option.innerHTML;
            // SET CURRENT REFERENCE VALUE
            // setSelectedReference(option.innerHTML);
          }, 300);

          selectedOption.parentElement.classList.remove("active");
        });
      });
      var selectedOptionSize: any = document.querySelector(
        ".selected-option-size"
      );
      var optionsSize: any = document.querySelectorAll(".option-size");

      selectedOptionSize.addEventListener("click", () => {
        selectedOptionSize.parentElement.classList.toggle("active");
      });

      optionsSize.forEach((optionsSize: any) => {
        optionsSize.addEventListener("click", () => {
          setTimeout(() => {
            selectedOptionSize.innerHTML = optionsSize.innerHTML;
            // SET CURRENT REFERENCE VALUE
            setAddSize(optionsSize.innerHTML);
          }, 300);

          selectedOptionSize.parentElement.classList.remove("active");
        });
      });
    };
  }, []);

  const handlerAddSupplies = () => {
    var selectedOption: any = document.querySelector(".selected-option");
    var amountHTML: any = document.querySelector(".amountInput");
    let enableSelector =
      selectedOption.innerHTML !== "Seleccionar" &&
      selectedOption.innerHTML !== "";
    let enableAmount = Number.isInteger(amountHTML) && amountHTML > 0;
    if (enableSelector && enableAmount) {
      let informationObject: ISupplyInformation = {
        supplyCode: selectedOption.innerHTML,
        supplyAmount: inputAmount,
      };
      setAddedInformation([...addedInformation, informationObject]);

      // SET EMPTY VALUES
      amountHTML.value = null;
      selectedOption.innerHTML = "";
    } else {
      dispatch({ type: "WRONG_INPUT" });
    }
  };

  const handlerSaveNewReference = () => {
    let selectedOptionSize: any = document.querySelector(
      ".selected-option-size"
    );
    const requestPayload = {
      addReference: addReference,
      addSize: addSize,
      addDescription: addDescription,
      addColor: addColor,
      addImageName: addImageName,
      addedInformation,
    };

    let enable =
      addReference != "" &&
      addSize != "Seleccionar" &&
      addDescription != "" &&
      addColor != "" &&
      addImageName != "" &&
      addedInformation.length != 0;
    console.log(requestPayload);
    if (enable) {
      Axios.post(dbSaveNewReference, requestPayload).then(
        (response: AxiosResponse): void => {
          console.log(response);
          if (response.data === "SUCCESSFUL_REQUEST") {
            setEmptyValues();
            dispatch({ type: "SUCCESSFUL_REQUEST" });
          }
          if (response.data === "FAILED_REQUEST") {
            dispatch({ type: "FAILED_REQUEST" });
          }
          if (response.data === "INVALID_REFERENCE") {
            dispatch({ type: "INVALID_REFERENCE" });
          }
        }
      );
    } else {
      dispatch({ type: "WRONG_INPUT" });
    }
  };

  const closeModal = () => {
    dispatch({ tpye: "CLOSE_MODAL" });
  };

  const setEmptyValues = () => {
    let selectedOption: any = document.querySelector(".selected-option");
    let addReferenceOption: any = document.querySelector(
      ".add-reference-input"
    );
    let addSizeOption: any = document.querySelector(".selected-option-size");
    let addDescriptionOption: any = document.querySelector(
      ".add-description-input"
    );
    let addColorOption: any = document.querySelector(".add-color-input");
    let addImageNameOption: any = document.querySelector(
      ".add-imagename-input"
    );
    let addAmountOption: any = document.querySelector(".amountInput");
    // let : any = document.querySelector(".selected-option");

    selectedOption.innerHTML = "Seleccionar";
    addReferenceOption.value = "";
    addSizeOption.innerHTML = "Seleccionar";
    addDescriptionOption.value = "";
    addColorOption.value = "";
    addImageNameOption.value = "";
    addAmountOption.value = null;
    setAddedInformation([]);
  };

  return (
    <div>
      <h1>Taller diseño</h1>

      <input
        className="add-reference-input"
        type="text"
        onChange={(e) => setAddReference(e.target.value)}
      ></input>
      <div className="references-container">
        <div className="title">Seleccionar codigo talla:</div>
        <div className="select-container">
          <p className="selected-option-size">Seleccionar</p>
          <ul className="options-container">
            <li className="option-size">1</li>
            <li className="option-size">2</li>
            <li className="option-size">3</li>
            <li className="option-size">4</li>
          </ul>
        </div>
      </div>
      <input
        className="add-description-input"
        type="text"
        onChange={(e) => setAddDescription(e.target.value)}
      ></input>
      <input
        className="add-color-input"
        type="text"
        onChange={(e) => setAddColor(e.target.value)}
      ></input>
      <input
        className="add-imagename-input"
        type="text"
        onChange={(e) => setAddImageName(e.target.value)}
      ></input>
      <div className="references-container">
        <div className="title">Seleccionar codigo insumo:</div>
        <div className="select-container">
          <p className="selected-option">Seleccionar</p>
          <ul className="options-container">
            {dBWareHouseSupplies.map(
              (suppliesInformation: IWareHouseSupplies) => {
                return <li className="option">{suppliesInformation.codigo}</li>;
              }
            )}
          </ul>
        </div>
      </div>
      <div>Cantidad:</div>
      <input
        className="amountInput"
        type="number"
        onChange={(e) => setInputAmount(e.target.value)}
      ></input>
      <div>
        <button type="button" onClick={handlerAddSupplies}>
          Añadir Insumo
        </button>
      </div>
      {addedInformation.map((item, index) => {
        return (
          <div key={index}>
            Codigo: {item.supplyCode} y Cantidad: {item.supplyAmount}
          </div>
        );
      })}
      <div>
        <button type="button" onClick={handlerSaveNewReference}>
          Guardar
        </button>
      </div>
      {state.isModalOpen && (
        <ModalDesign
          modalContent={state.modalContent}
          closeModal={closeModal}
          checkNumber={state.checkNumber}
        />
      )}
    </div>
  );
};

export default withRouter(Design);
