import React, { useState, useEffect, useReducer } from "react";
import Axios, { AxiosResponse } from "axios";
import { withRouter } from "react-router-dom";

import { reducer } from "../components/design/ReducerDesign";
import "./style/Design.css";
import ModalDesignInventory from "../components/design/ModalDesignInventory";
import { baseURL } from "../components/app/baseURL";
import Modal from "../components/Modal";
import completeImage from "../assets/complete.svg";
import errorImage from "../assets/error.svg";
import noDataImage from "../assets/no-data.svg";
import ModalAddSupplies from "../components/design/ModalDesignAddSupplies";
import FilterDropdown from "../components/FilterDropdown";

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
  isInventoryModalOpen: false,
  modalInventoryContent: [],
  checkNumber: 0,
  imgCheckNumber: 0,
};

const Design = () => {
  const dbWareHouseCodesURL: string = baseURL + "api/warehousecodes";
  const dbSaveNewReference: string = baseURL + "api/savenewreference";
  const productionAPIURL: string = baseURL + "api/production";
  const [switchReRender, setSwitchReRender] = useState<boolean>(false);
  const [isModalDesignOpen, setIsModalDesignOpen] = useState<boolean>(false);
  const [addReference, setAddReference] = useState<string>("");
  const [addDescription, setAddDescription] = useState<string>("");
  const [addColor, setAddColor] = useState<string>("");
  const [addImageName, setAddImageName] = useState<string>("");
  const [addValuePerUnit, setAddValuePerUnit] = useState<string>("");
  const [valueSizeSelect, setValueSizeSelect] = useState<any>(null);
  const sizesArray: any = [
    { codigo: "1", label: "XS" },
    { codigo: "2", label: "S" },
    { codigo: "3", label: "M" },
    { codigo: "4", label: "L" },
    { codigo: "5", label: "XL" },
  ];
  let addSize: any = "";
  const [addedInformationFromModal, setAddedInformationFromModal] =
    useState<any>([]);
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [modalAddSupplies, setModalAddSupplies] = useState<boolean>(false);
  const [toggleState, setToggleState] = useState(1);

  useEffect(() => {
    Axios.get(dbWareHouseCodesURL).then((response: AxiosResponse) => {});
    Axios.get(productionAPIURL)
      .then((response: any) => {
        dispatch({
          type: "SUCCESSFUL_SAMPLE_INVENTORY",
          payload: response.data,
        });
      })
      .catch((error) => {});
  }, [switchReRender]);

  const handlerAddSupplies = () => {
    setModalAddSupplies(true);
  };

  const handlerSaveNewReference = () => {
    let selectedOptionSize: any = document.querySelector(
      ".selected-option-size"
    );
    let isCodeExist = 0;

    if (valueSizeSelect === null) {
      addSize = "";
    } else if (typeof valueSizeSelect === "object") {
      addSize = valueSizeSelect.codigo.toString();
    } else if (typeof valueSizeSelect === "string") {
      addSize = valueSizeSelect;
    }

    sizesArray.map((val: any) => {
      if (val.codigo === addSize) {
        isCodeExist += 1;
        return isCodeExist;
      } else {
        return isCodeExist;
      }
    });

    const requestPayload = {
      addReference: addReference,
      addSize: addSize,
      addDescription: addDescription,
      addColor: addColor,
      addImageName: addImageName,
      valuePerUnit: addValuePerUnit,
      addedInformationFromModal,
    };

    let enable =
      addReference != "" &&
      addSize != "" &&
      addDescription != "" &&
      addColor != "" &&
      addImageName != "" &&
      addValuePerUnit != "" &&
      addedInformationFromModal.length != 0;
    if (enable) {
      if (isCodeExist === 1) {
        Axios.post(dbSaveNewReference, requestPayload).then(
          (response: AxiosResponse): void => {
            if (response.data === "SUCCESSFUL_REQUEST") {
              setEmptyValues();
              dispatch({ type: "SUCCESSFUL_REQUEST" });
              setSwitchReRender(!switchReRender);
              setIsModalDesignOpen(true);
            }
            if (response.data === "FAILED_REQUEST") {
              dispatch({ type: "FAILED_REQUEST" });
              setIsModalDesignOpen(true);
            }
            if (response.data === "INVALID_REFERENCE") {
              dispatch({ type: "INVALID_REFERENCE" });
              setIsModalDesignOpen(true);
            }
          }
        );
      } else {
        dispatch({ type: "CODE_DOES_NOT_EXIST" });
        setIsModalDesignOpen(true);
      }
    } else {
      dispatch({ type: "WRONG_INPUT" });
      setIsModalDesignOpen(true);
    }
  };

  const closeModal = () => {
    dispatch({ tpye: "CLOSE_MODAL" });
    setIsModalDesignOpen(false);
  };

  const setEmptyValues = () => {
    let addReferenceOption: any = document.querySelector(
      ".add-reference-input"
    );
    let addDescriptionOption: any = document.querySelector(
      ".add-description-input"
    );
    let addColorOption: any = document.querySelector(".add-color-input");
    let addImageNameOption: any = document.querySelector(
      ".add-imagename-input"
    );

    let addValuePerUnit: any = document.getElementById("value-per-unit-input");

    addReferenceOption.value = "";
    setValueSizeSelect(null);
    addDescriptionOption.value = "";
    addColorOption.value = "";
    addImageNameOption.value = "";
    addValuePerUnit.value= "";
    setAddedInformationFromModal([]);
    setAddReference("");
    setAddDescription("");
    setAddColor("");
    setAddImageName("");
    setAddValuePerUnit("");
  };

  const handleInventory = () => {
    Axios.get(productionAPIURL)
      .then((response: any) => {
        dispatch({
          type: "SUCCESSFUL_SAMPLE_INVENTORY",
          payload: response.data,
        });
      })
      .catch((error) => {});
  };

  const closeModalAddSupplies = () => {
    setModalAddSupplies(false);
  };

  const handleNavbarClick = (e: any) => {
    e.preventDefault();
    const target = e.target.getAttribute("href");
    const location = document.querySelector(target).offsetTop;
    const scrollDiv = document.getElementById(
      "scroll-design-section"
    ) as HTMLDivElement;

    scrollDiv.scrollTo(0, location - 55);
  };

  const toggleTab = (index: number) => {
    setToggleState(index);
  };

  return (
    <div className="general-container-design">
      <div className="navbar-design">
        <h2 className="navbar-design__h2">Taller diseño</h2>
        <div className="navbar-design-options">
          <div
            className={
              toggleState === 1
                ? "tabs-design active-tabs-design"
                : "tabs-design"
            }
            onClick={() => toggleTab(1)}
          >
            <a
              href="#add-reference-design-container"
              onClick={handleNavbarClick}
            >
              Agregar una nueva muestra
            </a>
          </div>
          <div
            className={
              toggleState === 2
                ? "tabs-design active-tabs-design"
                : "tabs-design"
            }
            onClick={() => toggleTab(2)}
          >
            <a
              href="#inventory-design-modal-section"
              onClick={handleNavbarClick}
            >
              Inventario de las muestras
            </a>
          </div>
        </div>
      </div>
      <div className="scroll-design-section" id="scroll-design-section">
        <div
          className="add-reference-design-container"
          id="add-reference-design-container"
        >
          <form className="design-form">
            <h2>Agregar muestra</h2>
            <div className="border-design-div"></div>
            <p className="design-form__information">
              En este formulario puedes asociar insumos a una nueva muestra.
              Digita la referencia, selecciona la talla, agrega una descripcion,
              digita el color y la URL de la imágen. Luego, presiona el botón
              'Añadir/Eliminar Insumos' para agregar o eliminar los insumos que
              consume esta nueva muestra. Por ultimo, presiona el botón de
              'Guardar'.
            </p>
            <input
              className="add-reference-input"
              type="number"
              placeholder="Referencia"
              onChange={(e) => setAddReference(e.target.value)}
            />
            <div className="dropdownDesign">
              <FilterDropdown
                options={sizesArray}
                id="codigo"
                label="label"
                prompt="Seleccionar el codigo de talla"
                value={valueSizeSelect}
                onChange={(val: any) => setValueSizeSelect(val)}
              />
            </div>
            <input
              className="add-description-input"
              type="text"
              placeholder="Descripción"
              onChange={(e) => setAddDescription(e.target.value)}
            />
            <input
              className="add-color-input"
              type="text"
              placeholder="Color"
              onChange={(e) => setAddColor(e.target.value)}
            />
            <input
              className="add-imagename-input"
              type="text"
              placeholder="URL de la imágen"
              onChange={(e) => setAddImageName(e.target.value)}
            />
            <input
              className="value-per-unit-input"
              id="value-per-unit-input"
              type="number"
              placeholder="Valor de la unidad"
              onChange={(e) => setAddValuePerUnit(e.target.value)}
            />
            <button
              type="button"
              className="btn"
              id="insumoBTN"
              onClick={handlerAddSupplies}
            >
              Añadir/Eliminar Insumos
            </button>
            {addedInformationFromModal.length !== 0 && (
              <button
                type="button"
                className="btn"
                id="saveBTN"
                onClick={handlerSaveNewReference}
              >
                Guardar
              </button>
            )}
          </form>
          <div className="supplies-added-design">
            <h3>Insumos agregados</h3>
            {addedInformationFromModal.length == 0 && (
              <>
                <div className="no-data-image-container">
                  <img
                    src={noDataImage}
                    alt="no-data"
                    className="no-data-image-container__img"
                  />
                </div>
                <p className="no-data-paragraph">
                  Aún no se han añadido insumos
                </p>
              </>
            )}
            {addedInformationFromModal.map((item: any) => {
              return (
                <div key={item.supplyCode} className="insumo-add">
                  <h2>Item agregado: </h2>
                  Codigo: {item.supplyCode} - Cantidad: {item.supplyAmount}
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="inventory-design-modal-section"
          id="inventory-design-modal-section"
        >
          <h3>Inventario de las muestras</h3>
          <p>
            En este apartado se despliega el inventario de las muestras. Si
            quieres saber que telas e insumos consume una muestra en especifico,
            presiona el botón 'Información de consumo'.
          </p>
          <ModalDesignInventory
            closeModal={closeModal}
            modalContent={state.modalInventoryContent}
          />
        </div>
      </div>
     {isModalDesignOpen && (
        <Modal isOpen={true} closeModal={closeModal}>
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
     )}
      <ModalAddSupplies
        isOpen={modalAddSupplies}
        // isOpen={true}
        closeModal={closeModalAddSupplies}
        suppliesFromDesign={(msg: any) => setAddedInformationFromModal(msg)}
      />
    </div>
  );
};

export default withRouter(Design);
