import React, {useState, useEffect, useReducer} from 'react';
import Axios, {AxiosResponse} from 'axios';
import {withRouter} from 'react-router-dom';
import ModalDesign from '../components/design/ModalDesign';
import {reducer} from '../components/design/ReducerDesign';
import './style/Design.css';
import ModalDesignInventory from '../components/design/ModalDesignInventory';
import {baseURL} from '../components/app/baseURL';
import Modal from '../components/Modal';
import completeImage from '../assets/complete.svg';
import errorImage from '../assets/error.svg';

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
  const [dBWareHouseSupplies, setdBWareHouseSupplies] = useState<
    IWareHouseSupplies[]
  >([]);
  const [addReference, setAddReference] = useState<string>('');
  const [addSize, setAddSize] = useState<string>('');
  const [addDescription, setAddDescription] = useState<string>('');
  const [addColor, setAddColor] = useState<string>('');
  const [addImageName, setAddImageName] = useState<string>('');
  const [inputAmount, setInputAmount] = useState<string>('');
  const [addedInformation, setAddedInformation] = useState<
    ISupplyInformation[]
  >([]);
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [switchNumber, setSwitchNumber] = useState<number>(0);
  const [switchSection, setSwitchSection] = useState<boolean>(false);

  useEffect(() => {
    Axios.get(dbWareHouseCodesURL).then((response: AxiosResponse) => {
      setdBWareHouseSupplies(response.data);
      console.log(response.data);
      triggerListeners();
    });
  }, [switchSection]);

  const triggerListeners = () => {
    var selectedOption: any = document.querySelector('.selected-option');
    var options: any = document.querySelectorAll('.option-design');

    selectedOption.addEventListener('click', () => {
      selectedOption.parentElement.classList.toggle('active');
    });

    options.forEach((option: any) => {
      option.addEventListener('click', () => {
        setTimeout(() => {
          selectedOption.innerHTML = option.innerHTML;
          // SET CURRENT REFERENCE VALUE
          // setSelectedReference(option.innerHTML);
        }, 300);

        selectedOption.parentElement.classList.remove('active');
      });
    });
    var selectedOptionSize: any = document.querySelector(
      '.selected-option-size'
    );
    var optionsSize: any = document.querySelectorAll('.option-size-design');

    selectedOptionSize.addEventListener('click', () => {
      selectedOptionSize.parentElement.classList.toggle('active');
    });

    optionsSize.forEach((optionsSize: any) => {
      optionsSize.addEventListener('click', () => {
        setTimeout(() => {
          selectedOptionSize.innerHTML = optionsSize.innerHTML;
          // SET CURRENT REFERENCE VALUE
          setAddSize(optionsSize.innerHTML);
        }, 300);

        selectedOptionSize.parentElement.classList.remove('active');
      });
    });
  };

  const handlerAddSupplies = () => {
    var selectedOption: any = document.querySelector('.selected-option');
    var amountHTML: any = document.querySelector('.amountInput');
    console.log(selectedOption.innerHTML);
    console.log(amountHTML.value);
    let enableSelector =
      selectedOption.innerHTML !== 'Seleccionar codigo insumo' &&
      selectedOption.innerHTML !== '';
    let enableAmount =
      Number.isInteger(parseInt(amountHTML.value)) &&
      parseInt(amountHTML.value) > 0;
    console.log(typeof amountHTML.value);
    if (enableSelector && enableAmount) {
      let informationObject: ISupplyInformation = {
        supplyCode: selectedOption.innerHTML,
        supplyAmount: inputAmount,
      };
      setAddedInformation([...addedInformation, informationObject]);

      // SET EMPTY VALUES
      amountHTML.value = null;
      selectedOption.innerHTML = 'Seleccionar codigo insumo';
    } else {
      dispatch({type: 'WRONG_INPUT'});
    }
  };

  const handlerSaveNewReference = () => {
    let selectedOptionSize: any = document.querySelector(
      '.selected-option-size'
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
      addReference != '' &&
      addSize != 'Seleccionar' &&
      addDescription != '' &&
      addColor != '' &&
      addImageName != '' &&
      addedInformation.length != 0;
    console.log(requestPayload);
    if (enable) {
      Axios.post(dbSaveNewReference, requestPayload).then(
        (response: AxiosResponse): void => {
          console.log(response);
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
      dispatch({type: 'WRONG_INPUT'});
    }
  };

  const closeModal = () => {
    dispatch({tpye: 'CLOSE_MODAL'});
  };

  const setEmptyValues = () => {
    let selectedOption: any = document.querySelector('.selected-option');
    let addReferenceOption: any = document.querySelector(
      '.add-reference-input'
    );
    let addSizeOption: any = document.querySelector('.selected-option-size');
    let addDescriptionOption: any = document.querySelector(
      '.add-description-input'
    );
    let addColorOption: any = document.querySelector('.add-color-input');
    let addImageNameOption: any = document.querySelector(
      '.add-imagename-input'
    );
    let addAmountOption: any = document.querySelector('.amountInput');
    // let : any = document.querySelector(".selected-option");

    selectedOption.innerHTML = 'Seleccionar';
    addReferenceOption.value = '';
    addSizeOption.innerHTML = 'Seleccionar';
    addDescriptionOption.value = '';
    addColorOption.value = '';
    addImageNameOption.value = '';
    addAmountOption.value = null;
    setAddedInformation([]);
  };

  const handleForm = () => {
    setSwitchNumber(0);
    setSwitchSection(!switchSection);
  };

  const handleInventory = () => {
    setSwitchNumber(1);
    Axios.get(productionAPIURL)
      .then((response: any) => {
        console.log(response.data);
        dispatch({type: 'SUCCESSFUL_SAMPLE_INVENTORY', payload: response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="general-container-design">
      <h2 className="general-container-design__h2">Taller diseño</h2>
      <p className="general-container-design__p">
        ¡Hola!, Aqui puedes agregar nuevas referencias y observar la inforamción
        de estas.
      </p>
      <div className="switch-design-container">
        <button className="btn addButton" onClick={handleForm}>
          Agregar muestra
        </button>
        <button className="btn inventoryButton" onClick={handleInventory}>
          Inventario muestra
        </button>
      </div>
      {switchNumber === 0 && (
        <div className="ingreso-referencia-container">
          <form className="design-form">
            <h2>Agregar referencia</h2>
            <div className="border-design-div"></div>
            <input
              className="add-reference-input"
              type="text"
              placeholder="Referencia"
              onChange={(e) => setAddReference(e.target.value)}
            />
            <div className="select-container-design">
              <p className="selected-option-size">
                Seleccionar el codigo de talla
              </p>
              <ul className="options-container-design">
                <li className="option-size-design">1</li>
                <li className="option-size-design">2</li>
                <li className="option-size-design">3</li>
                <li className="option-size-design">4</li>
              </ul>
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
            <div className="select-container-design">
              <p className="selected-option">Seleccionar codigo insumo</p>
              <ul className="options-container-design">
                {dBWareHouseSupplies.map(
                  (suppliesInformation: IWareHouseSupplies) => {
                    return (
                      <li className="option-design">
                        {suppliesInformation.codigo}
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
            <input
              className="amountInput"
              type="number"
              placeholder="Cantidad"
              onChange={(e) => setInputAmount(e.target.value)}
            ></input>
            <button
              type="button"
              className="btn"
              id="insumoBTN"
              onClick={handlerAddSupplies}
            >
              Añadir Insumo
            </button>
            <button
              type="button"
              className="btn"
              id="saveBTN"
              onClick={handlerSaveNewReference}
            >
              Guardar
            </button>
          </form>
          <div className="insumosAgregados">
            {addedInformation.map((item, index) => {
              return (
                <div key={index} className="insumo-add">
                  <h2>Item agregado: </h2>
                  Codigo: {item.supplyCode} - Cantidad: {item.supplyAmount}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {switchNumber === 1 && (
        <ModalDesignInventory
          closeModal={closeModal}
          modalContent={state.modalInventoryContent}
        />
      )}
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

export default withRouter(Design);
