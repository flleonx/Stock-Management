import React, {useEffect, useState, useReducer} from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';

import './style/ModalDesignAddSupplies.css';
import {baseURL} from '../app/baseURL';
import ModalDesign from './ModalDesign';
import ModalDesignInventory from './ModalDesignInventory';
import FilterDropdown from '../FilterDropdown';
import {type} from 'node:os';

const addSuppliesID: any = document.getElementById('addSupplies');

const reducer = (state: any, action: any) => {
  if (action.type === 'WRONG_INFORMATION') {
    return {
      ...state,
      isOpen: true,
      modalContent: 'Por favor digite bien todos los campos',
    };
  }

  if (action.type === 'CODE_DOES_NOT_EXIST') {
    return {
      ...state,
      isOpen: true,
      modalContent: 'Esté código no existe. Por favor digitar otro',
    };
  }

  if (action.type === 'CODE_EXIST') {
    return {
      ...state,
      isOpen: true,
      modalContent: 'Error: Este código ya está agregado',
    };
  }

  if (action.type === 'CLOSE_MODAL') {
    return {
      ...state,
      isOpen: false,
    };
  }

  return {
    ...state,
    isOpen: false,
  };
};

interface IWareHouseSupplies {
  codigo: number;
  color: string;
  metros: number;
  cantidad: number;
  descripcion: string;
  nombre_imagen: string;
  timestamp: string;
}

interface ISupplyInformation {
  supplyCode: string;
  supplyAmount: string;
}

interface IDefaultState {
  isModalOpen: boolean;
  modalContent: string;
}

const defaultState: IDefaultState = {
  isModalOpen: false,
  modalContent: '',
};

const ModalDesignAddSupplies = (props: any) => {
  const [valueSelect, setValueSelect] = useState<any>(null);
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [dBWareHouseSupplies, setdBWareHouseSupplies] = useState<
    IWareHouseSupplies[]
  >([]);
  const [addedInformation, setAddedInformation] = useState<
    ISupplyInformation[]
  >([]);
  const dbWareHouseCodesURL: string = baseURL + 'api/warehousecodes';
  const [inputAmount, setInputAmount] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<any>(
    'Seleccionar insumo'
  );
  let optionSelectCode: any = [];
  let valueSelectComp: any = '';
  let inputSelectIterator = 0;
  let inputSelectAddedInfo = 0;

  useEffect(() => {
    Axios.get(dbWareHouseCodesURL).then((response: any) => {
      setdBWareHouseSupplies(response.data);
      if (props.isOpen) {
      }
    });
  }, [props.isOpen]);

  const handlerAddSupplies = () => {
    var amountHTML: any = document.querySelector('.amountSuppliesInput');

    //SELECT COMPROBATION
    if (valueSelect === null) {
      valueSelectComp = {
        codigo: '',
      };
    } else if (typeof valueSelect === 'object') {
      valueSelectComp = valueSelect.codigo.toString();
    } else if (typeof valueSelect === 'string') {
      valueSelectComp = valueSelect;
    }

    dBWareHouseSupplies.map((val: any) => {
      if (val.codigo === parseInt(valueSelectComp)) {
        inputSelectIterator += 1;
        return inputSelectIterator;
      } else {
        return inputSelectIterator;
      }
    });

    addedInformation.map((val: any) => {
      if (val.supplyCode === valueSelectComp) {
        inputSelectAddedInfo += 1;
        return inputSelectAddedInfo;
      } else {
        return inputSelectAddedInfo;
      }
    });

    let enableSelector = valueSelectComp !== '' || valueSelectComp !== null;
    let enableAmount =
      Number.isInteger(parseInt(amountHTML.value)) &&
      parseInt(amountHTML.value) > 0;
    if (enableSelector && enableAmount) {
      if (inputSelectIterator === 1) {
        if (inputSelectAddedInfo === 0) {
          let informationObject: ISupplyInformation = {
            supplyCode: valueSelectComp,
            supplyAmount: inputAmount,
          };
          setAddedInformation([...addedInformation, informationObject]);

          // SET EMPTY VALUES
          amountHTML.value = null;
          setValueSelect(null);
        } else {
          dispatch({type: 'CODE_EXIST'});
        }
      } else {
        dispatch({type: 'CODE_DOES_NOT_EXIST'});
      }
    } else {
      dispatch({type: 'WRONG_INFORMATION'});
    }
  };

  const handleClose = () => {
    props.closeModal();
  };

  const removeItem = (code: any) => {
    let newAddedInformation = addedInformation.filter(
      (item) => item.supplyCode !== code
    );
    setAddedInformation(newAddedInformation);
  };

  const closeModal = () => {
    dispatch({type: 'CLOSE_MODAL'});
  };

  if (!props.isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="ModalAddSuppliesComponent">
      <div className="ModalAddSuppliesComponent__container">
        <button
          onClick={handleClose}
          className="ModalAddSuppliesComponent__close-button"
        >
          X
        </button>
        <h4>Añadir telas o insumos</h4>
        <p className="ModalAddSuppliesComponent__p">
          Aquí puedes añadir telas o insumos para la referencia que estás
          intentando guardar.
        </p>
        <div className="addSuppliesZone">
          <div style={{width: 250}}>
            <FilterDropdown
              options={dBWareHouseSupplies}
              id="codigo"
              label="codigo"
              prompt={'Seleccionar insumo'}
              value={valueSelect}
              onChange={(val: any) => setValueSelect(val)}
            />
          </div>
          <input
            type="number"
            className="amountSuppliesInput"
            placeholder="Digite la cantidad"
            autoComplete="off"
            onChange={(e) => setInputAmount(e.target.value)}
          />
          <button className="btn" onClick={handlerAddSupplies}>
            Añadir
          </button>
        </div>
        {state.isOpen && (
          <ModalDesign
            modalContent={state.modalContent}
            closeModal={closeModal}
          />
        )}
        <div className="added-container-supplies">
          {addedInformation.map((item) => {
            return (
              <div key={item.supplyCode} className="supplie-add">
                <h2>Item agregado: </h2>
                Codigo: {item.supplyCode} - Cantidad: {item.supplyAmount}
                <button
                  className="removeItemAddSupplies"
                  onClick={() => removeItem(item.supplyCode)}
                >
                  X
                </button>
              </div>
            );
          })}
        </div>
        <div className="buttonAddSuppliesContainer">
          <button
            className="buttonAddSuppliesContainer__ready"
            onClick={() => {
              props.suppliesFromDesign(addedInformation);
              props.closeModal();
            }}
          >
            Listo
          </button>
          <button
            className="buttonAddSuppliesContainer__cancel"
            onClick={handleClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    addSuppliesID
  );
};

export default ModalDesignAddSupplies;
