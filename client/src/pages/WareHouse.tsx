import React, {useState, useEffect, useReducer} from 'react';
import {withRouter, Link} from 'react-router-dom';
import Axios from 'axios';
import './style/Warehouse.css';
import ModalInvetoryBodega from '../components/bodega/ModalInventoryBodega';
import ModalBodegaForm from '../components/bodega/ModalBodegaForm';
import {baseURL} from '../components/app/baseURL';

const reducer = (state: any, action: any) => {
  if (action.type === 'INVENTORY_BODEGA') {
    const invetoryBodegaContent = action.payload;
    return {...state, modalContent: invetoryBodegaContent, isModalOpen: true};
  }

  if (action.type === 'SUCCESSFUL_FORM') {
    return {
      ...state,
      modalFormContent:
        '¡Felicitaciones! Se ha agregado un nuevo insumo correctamente',
      isFormModalOpen: true,
    };
  }

  if (action.type === 'CLOSE_MODAL') {
    return {...state, isModalOpen: false};
  }
  return {...state, isModalOpen: false, isFormModalOpen: false};
};

const defaultState: any = {
  isModalOpen: false,
  isFormModalOpen: false,
  modalContent: [],
  modalFormContent: '',
  checkNumber: 0,
};

function WareHouse() {
  const [code, setCode] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [img, setImg] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [state, dispatch] = useReducer(reducer, defaultState);
  const saveClothAPIURL: string = baseURL + 'api/savecloth';
  const invetoryBodegaAPIURL: string = baseURL + 'api/invetorywarehouse';

  useEffect(() => {
    triggerListeners(setType);
  }, []);

  interface ICloth {
    code: string;
    color: string;
    amount: string;
    description: string;
    img: string;
    type: string;
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newCloth: ICloth = {
      code,
      color,
      amount,
      description,
      img,
      type,
    };
    Axios.post(saveClothAPIURL, {
      newCloth,
    })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
    let codigoInput = document.getElementById('codigo') as HTMLInputElement;
    let colorInput = document.getElementById('color') as HTMLInputElement;
    let amountInput = document.getElementById('amount') as HTMLInputElement;
    let descripcionInput = document.getElementById(
      'descripcion'
    ) as HTMLInputElement;
    let imgInput = document.getElementById('url-img') as HTMLInputElement;
    let selectedOption: any = document.querySelector('.selected-option-bodega');

    codigoInput.value = '';
    colorInput.value = '';
    amountInput.value = '';
    descripcionInput.value = '';
    imgInput.value = '';
    selectedOption.innerHTML = 'Seleccionar tela o insumo';

    dispatch({type: 'SUCCESSFUL_FORM'});
  };

  const handleInvetoryTable = (e: any) => {
    e.preventDefault();
    Axios.get(invetoryBodegaAPIURL)
      .then((response: any) => {
        console.log(response.data);
        dispatch({type: 'INVENTORY_BODEGA', payload: response.data});
      })
      .catch((error) => {
        if (error) throw error;
      });
  };

  const closeModal = () => {
    dispatch({tpye: 'CLOSE_MODAL'});
  };

  return (
    <div className="general-container-bodega">
      <h2 className="general-container-bodega__h2">Bodega</h2>
      <p className="general-container-bodega__p">
        ¡Hola!, ¿Hay insumos nuevos que agregar o solo echarás un vistazo?
      </p>
      <div className="body-bodega-information">
        <form className="bodega-form">
          <h2>Agregar telas o insumos</h2>
          <div className="border-div"></div>
          <input
            type="text"
            id="codigo"
            placeholder="Codigo"
            onChange={(e: any) => setCode(e.target.value)}
          />
          <input
            type="text"
            id="color"
            placeholder="Color"
            onChange={(e: any) => setColor(e.target.value)}
          />
          <input
            type="text"
            id="amount"
            placeholder="Metros/Cantidad"
            onChange={(e: any) => setAmount(e.target.value)}
          />
          <input
            type="text"
            id="descripcion"
            placeholder="Descripción"
            className="descriptionInput"
            onChange={(e: any) => setDescription(e.target.value)}
          />
          <input
            type="text"
            id="url-img"
            placeholder="URL de la imágen"
            onChange={(e: any) => setImg(e.target.value)}
          />
          <div className="select-container-bodega">
            <p className="selected-option-bodega">Seleccionar tela o insumo</p>
            <ul className="options-container-bodega">
              <li className="option-bodega">Tela</li>
              <li className="option-bodega">Insumo</li>
            </ul>
          </div>
          <button className="btn" onClick={handleSubmit}>
            Enviar
          </button>
          {state.isFormModalOpen && (
            <ModalBodegaForm
              modalContent={state.modalFormContent}
              closeModal={closeModal}
            />
          )}
        </form>
        <div className="bodega-inventory">
          <h2>Click aquí para desplegar el inventario en Bodega:</h2>
          <button className="btn" onClick={handleInvetoryTable}>
            Desplegar
          </button>
        </div>
      </div>
      {state.isModalOpen && (
        <ModalInvetoryBodega
          modalContent={state.modalContent}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

const triggerListeners = (setType: any) => {
  var selectedOption: any = document.querySelector('.selected-option-bodega');
  var options: any = document.querySelectorAll('.option-bodega');

  selectedOption.addEventListener('click', () => {
    selectedOption.parentElement.classList.toggle('active-bodega');
  });

  options.forEach((option: any) => {
    option.addEventListener('click', () => {
      setTimeout(() => {
        selectedOption.innerHTML = option.innerHTML;
        // SET CURRENT REFERENCE VALUE
        setType(option.innerHTML);
      }, 300);

      selectedOption.parentElement.classList.remove('active-bodega');
    });
  });
};

export default withRouter(WareHouse);
