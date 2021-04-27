import React, {useState, useEffect, useReducer} from 'react';
import Axios, {AxiosResponse} from 'axios';
import {withRouter} from 'react-router-dom';

import {reducer} from '../components/design/ReducerDesign';
import './style/Design.css';
import ModalDesignInventory from '../components/design/ModalDesignInventory';
import {baseURL} from '../components/app/baseURL';
import Modal from '../components/Modal';
import completeImage from '../assets/complete.svg';
import errorImage from '../assets/error.svg';
import noDataImage from '../assets/no-data.svg';
import ModalAddSupplies from '../components/design/ModalDesignAddSupplies';
import FilterDropdown from '../components/FilterDropdown';

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
  const dbWareHouseCodesURL: string = baseURL + 'api/warehousecodes';
  const dbSaveNewReference: string = baseURL + 'api/savenewreference';
  const productionAPIURL: string = baseURL + 'api/production';
  const [addReference, setAddReference] = useState<string>('');
  // const [addSize, setAddSize] = useState<string>('');
  const [addDescription, setAddDescription] = useState<string>('');
  const [addColor, setAddColor] = useState<string>('');
  const [addImageName, setAddImageName] = useState<string>('');
  const [valueSizeSelect, setValueSizeSelect] = useState<any>(null);
  const sizesArray: any = [
    {codigo: '1', label: '1'},
    {codigo: '2', label: '2'},
    {codigo: '3', label: '3'},
    {codigo: '4', label: '4'},
  ];
  let addSize: any = '';
  // const [addedInformation, setAddedInformation] = useState<
  //   ISupplyInformation[]
  // >([]);
  const [
    addedInformationFromModal,
    setAddedInformationFromModal,
  ] = useState<any>([]);
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [modalAddSupplies, setModalAddSupplies] = useState<boolean>(false);

  useEffect(() => {
    Axios.get(dbWareHouseCodesURL).then((response: AxiosResponse) => {});
    Axios.get(productionAPIURL)
      .then((response: any) => {
        dispatch({type: 'SUCCESSFUL_SAMPLE_INVENTORY', payload: response.data});
      })
      .catch((error) => {});
  }, []);

  const handlerAddSupplies = () => {
    setModalAddSupplies(true);
  };

  const handlerSaveNewReference = () => {
    let selectedOptionSize: any = document.querySelector(
      '.selected-option-size'
    );
    let isCodeExist = 0;

    if (valueSizeSelect === null) {
      addSize = '';
    } else if (typeof valueSizeSelect === 'object') {
      addSize = valueSizeSelect.codigo.toString();
    } else if (typeof valueSizeSelect === 'string') {
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
      addedInformationFromModal,
    };

    let enable =
      addReference != '' &&
      addSize != '' &&
      addDescription != '' &&
      addColor != '' &&
      addImageName != '' &&
      addedInformationFromModal.length != 0;
    if (enable) {
      if (isCodeExist === 1) {
        Axios.post(dbSaveNewReference, requestPayload).then(
          (response: AxiosResponse): void => {
            if (response.data === 'SUCCESSFUL_REQUEST') {
              setEmptyValues();
              dispatch({type: 'SUCCESSFUL_REQUEST'});
            }
            if (response.data === 'FAILED_REQUEST') {
              dispatch({type: 'FAILED_REQUEST'});
            }
            if (response.data === 'INVALID_REFERENCE') {
              dispatch({type: 'INVALID_REFERENCE'});
            }
          }
        );
      } else {
        dispatch({type: 'CODE_DOES_NOT_EXIST'});
      }
    } else {
      dispatch({type: 'WRONG_INPUT'});
    }
  };

  const closeModal = () => {
    dispatch({tpye: 'CLOSE_MODAL'});
  };

  const setEmptyValues = () => {
    let addReferenceOption: any = document.querySelector(
      '.add-reference-input'
    );
    // let addSizeOption: any = document.querySelector('.selected-option-size');
    let addDescriptionOption: any = document.querySelector(
      '.add-description-input'
    );
    let addColorOption: any = document.querySelector('.add-color-input');
    let addImageNameOption: any = document.querySelector(
      '.add-imagename-input'
    );
    // let : any = document.querySelector(".selected-option");

    addReferenceOption.value = '';
    setValueSizeSelect(null);
    addDescriptionOption.value = '';
    addColorOption.value = '';
    addImageNameOption.value = '';
    setAddedInformationFromModal([]);
  };

  const handleInventory = () => {
    Axios.get(productionAPIURL)
      .then((response: any) => {
        dispatch({type: 'SUCCESSFUL_SAMPLE_INVENTORY', payload: response.data});
      })
      .catch((error) => {});
  };

  const closeModalAddSupplies = () => {
    setModalAddSupplies(false);
  };

  const handleNavbarClick = (e: any) => {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    const location = document.querySelector(target).offsetTop;
    const scrollDiv = document.getElementById(
      'scroll-design-section'
    ) as HTMLDivElement;

    scrollDiv.scrollTo(0, location - 108);
  };

  return (
    <div className="general-container-design">
      <div className="navbar-design">
        <h2 className="navbar-design__h2">Taller diseño</h2>
        <div className="navbar-design-otpions">
          <a href="#add-reference-design-container" onClick={handleNavbarClick}>
            Agregar una nueva muestra
          </a>
          <a href="#inventory-design-modal-section" onClick={handleNavbarClick}>
            Inventario de las muestras
          </a>
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
            </p>
            <input
              className="add-reference-input"
              type="text"
              placeholder="Referencia"
              onChange={(e) => setAddReference(e.target.value)}
            />
            <div className="dropdownDesign">
              <FilterDropdown
                options={sizesArray}
                id="codigo"
                label="codigo"
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
          <ModalDesignInventory
            closeModal={closeModal}
            modalContent={state.modalInventoryContent}
          />
        </div>
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
