import React, {useState, useEffect, useReducer} from 'react';
import {withRouter, Link} from 'react-router-dom';
import Axios, {AxiosResponse} from 'axios';
import './style/Warehouse.css';
import ModalInvetoryWareHouse from '../components/warehouse/ModalInventoryWareHouse';
import {baseURL} from '../components/app/baseURL';
import Modal from '../components/Modal';
import completeImage from '../assets/complete.svg';
import errorImage from '../assets/error.svg';

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
      isModalOpen: false,
      imgCheckNumber: 1,
    };
  }

  if (action.type === 'SUCCESSFUL_UPDATE') {
    return {
      ...state,
      modalUpdateContent: 'Inventario añadido exitosamente',
      isModalUpdateOpen: true,
      isModalOpen: false,
      imgCheckNumber: 1,
    };
  }

  if (action.type === 'EXISTING_CODE') {
    return {
      ...state,
      modalFormContent:
        'Este codigo ya existe en el inventario. Por favor dirigirse a la sección de abajo para agregar cantidad del insumo existente',
      isFormModalOpen: true,
      isModalOpen: false,
      imgCheckNumber: 2,
    };
  }

  if (action.type === 'SUCCESSFUL_ADDING') {
    return {
      ...state,
      modalFormContent: 'Insumo añadido correctamente',
      isModalOpen: false,
      isFormModalOpen: true,
    };
  }

  if (action.type === 'WRONG_INPUT') {
    return {
      ...state,
      modalUpdateContent:
        'OJO: Por favor ingrese correctamente todos los campos',
      isModalUpdateOpen: true,
      isModalOpen: false,
      imgCheckNumber: 2,
    };
  }

  if (action.type === 'CLOSE_MODAL') {
    return {...state, isModalOpen: false, imgCheckNumber: 0};
  }
  return {
    ...state,
    isModalOpen: false,
    isFormModalOpen: false,
    isModalUpdateOpen: false,
  };
};

const defaultState: any = {
  isModalOpen: false,
  isFormModalOpen: false,
  isModalUpdateOpen: false,
  modalContent: [],
  modalFormContent: '',
  modalUpdateContent: '',
  checkNumber: 0,
  imgCheckNumber: 0,
};

function WareHouse() {
  const [code, setCode] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [img, setImg] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [queryData, setQueryData] = useState<any>([]);
  const [updateCode, setUpdateCode] = useState<string>('');
  const [updateAmount, setUpdateAmount] = useState<string>('');
  const saveClothAPIURL: string = baseURL + 'api/savecloth';
  const invetoryBodegaAPIURL: string = baseURL + 'api/invetorywarehouse';
  const invetoryWareHouseAPIURL: string = baseURL + 'api/invetorywarehouse';
  const updateInventoryWareHouseURL: string =
    baseURL + 'api/updatewarehouseinventory';

  useEffect(() => {
    Axios.get(invetoryWareHouseAPIURL).then((response: AxiosResponse) => {
      setQueryData(response.data);
      triggerListeners(setType, setUpdateCode);
    });
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
    let enableAmount = false;

    if (type == 'Tela') {
      enableAmount = parseFloat(amount) > 0;
    } else {
      enableAmount = Number.isInteger(parseInt(amount)) && parseInt(amount) > 0;
    }
    let enableItems =
      code !== 'Codigo' &&
      color !== 'Color' &&
      description !== 'Descripción' &&
      img !== 'URL de la imágen' &&
      type !== 'Seleccionar tela o insumo';
    if (enableAmount && enableItems) {
      let codigoInput = document.getElementById('codigo') as HTMLInputElement;
      let colorInput = document.getElementById('color') as HTMLInputElement;
      let amountInput = document.getElementById('amount') as HTMLInputElement;
      let descripcionInput = document.getElementById(
        'descripcion'
      ) as HTMLInputElement;
      let imgInput = document.getElementById('url-img') as HTMLInputElement;
      let selectedOption: any = document.querySelector(
        '.selected-option-bodega'
      );
      Axios.post(saveClothAPIURL, {
        newCloth,
      })
        .then((response: AxiosResponse) => {
          console.log(response.data);
          if (response.data == 'SUCCESSFUL_ADDING') {
            dispatch({type: 'SUCCESSFUL_FORM'});
            // dispatch({ type: "SUCCESSFUL_ADDING" });
            codigoInput.value = '';
            colorInput.value = '';
            amountInput.value = '';
            descripcionInput.value = '';
            imgInput.value = '';
            selectedOption.innerHTML = 'Seleccionar tela o insumo';
          }
          if (response.data == 'EXISTING_CODE') {
            dispatch({type: 'EXISTING_CODE'});
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      dispatch({type: 'WRONG_INPUT'});
    }
  };

  // UPDATE INVENTORY
  const handleUpdateInventory = () => {
    let enableAmount =
      Number.isInteger(parseInt(updateAmount)) && parseInt(updateAmount) > 0;
    let enableCode = updateCode !== 'Seleccionar código';

    if (enableAmount && enableCode) {
      let payloadUpdate = {
        code: updateCode,
        amount: updateAmount,
      };
      console.log(payloadUpdate);
      Axios.post(updateInventoryWareHouseURL, payloadUpdate).then(
        (response: any) => {
          console.log(response);
          if (response.data == 'SUCCESSFUL_UPDATE') {
            dispatch({type: 'SUCCESSFUL_UPDATE'});
          }
        }
      );
    } else {
      dispatch({type: 'WRONG_INPUT'});
    }
  };

  const handleInvetoryTable = (e: any) => {
    e.preventDefault();
    const enable = Axios.get(invetoryBodegaAPIURL)
      .then((response: any) => {
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
        ¡Hola!, Aquí podrás agregar nuevas telas e insumos, actualizar la
        cantidad de telas o insumos ya registrados y desplegar el inventario que
        hay en Bodega.
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
            type="number"
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
        </form>
        <div className="bodega-inventory">
          <h2>Click aquí para desplegar el inventario en Bodega:</h2>
          <button className="btn" onClick={handleInvetoryTable}>
            Desplegar
          </button>
        </div>
        {state.isModalOpen && (
          <ModalInvetoryWareHouse
            modalContent={state.modalContent}
            closeModal={closeModal}
          />
        )}
      </div>
      <div className="update-container">
        <h2>Actualizar Insumo</h2>
        <div className="update-container-form">
          <div className="select-update-inventory">
            <p className="selected-update-inventory">Seleccionar código</p>
            <ul className="options-update-inventory">
              {queryData.map((data: any) => {
                return (
                  <li key={data.codigo} className="option-update-inventory">
                    {data.codigo}
                  </li>
                );
              })}
            </ul>
          </div>
          <input
            type="number"
            id="amount-update-inventory"
            placeholder="Cantidad"
            className="amount-update-inventory"
            onChange={(e: any) => setUpdateAmount(e.target.value)}
          />
          <button className="btn" onClick={handleUpdateInventory}>
            {' '}
            Actualizar
          </button>
        </div>
      </div>
      {/* {state.isModalOpen && (
        <ModalInvetoryWareHouse
          modalContent={state.modalContent}
          closeModal={closeModal}
        />
      )} */}
      <Modal isOpen={state.isFormModalOpen} closeModal={closeModal}>
        <h1 className="modalWarehouseh1">{state.modalFormContent}</h1>
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
      <Modal isOpen={state.isModalUpdateOpen} closeModal={closeModal}>
        <h1 className="modalWarehouseh1">{state.modalUpdateContent}</h1>
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
}

const triggerListeners = (setType: any, setUpdateCode: any) => {
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

  var selectedCodeUpdateInventory: any = document.querySelector(
    '.selected-update-inventory'
  );
  var optionsUpdateInventory: any = document.querySelectorAll(
    '.option-update-inventory'
  );

  selectedCodeUpdateInventory.addEventListener('click', () => {
    selectedCodeUpdateInventory.parentElement.classList.toggle('active-bodega');
  });

  optionsUpdateInventory.forEach((option: any) => {
    option.addEventListener('click', () => {
      setTimeout(() => {
        selectedCodeUpdateInventory.innerHTML = option.innerHTML;
        // SET CURRENT REFERENCE VALUE
        setUpdateCode(option.innerHTML);
      }, 300);

      selectedCodeUpdateInventory.parentElement.classList.remove(
        'active-bodega'
      );
    });
  });
};

export default withRouter(WareHouse);
