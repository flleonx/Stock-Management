import React, {useState, useEffect, useReducer, useRef} from 'react';
import Axios, {AxiosResponse} from 'axios';
import SuccessfulModalDressMaking from '../components/dressmaking/SuccessfulModalDressMaking';
// REDUCER
import {reducer} from '../components/dressmaking/ReducerDressMaking';
import './style/DressMaking.css';
import '../components/dressmaking/style/buttonStyle.css';
import {baseURL} from '../components/app/baseURL';

// INTERFACES
interface IReference {
  referencia: number;
  id_talla: number;
  descripcion: string;
  color: string;
  nombre_imagen: string;
}

const defaultState: any = {
  modalContent: [],
  isModalOpen: false,
  checkNumber: 0,
};

const DressMaking: React.FC = () => {
  const [references, setReferences] = useState<IReference[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [selectedReference, setSelectedReference] = useState<string>('');
  const dbReferencesURL: string = baseURL + 'api/references';
  const dbSuppliesURL: string = baseURL + 'api/suppliesrequest';
  const [state, dispatch] = useReducer(reducer, defaultState);
  const refContainer: any = useRef(null);

  // HANDLE AMOUNT INPUT
  const handleInput = (input: any) => {
    setAmount(input);
    if (input.includes('.') || input.includes('-') || input.includes('!')) {
      const amountInputHTML: any = document.getElementById('amountInput');
      amountInputHTML.value = '';
      // refContainer.current.value = "";
      setAmount('');
    }
  };

  // GET REFERENCES
  useEffect(() => {
    Axios.get(dbReferencesURL).then((response: AxiosResponse) => {
      setReferences(response.data);
      triggerListeners();
    });

    const triggerListeners = () => {
      var selectedOption: any = document.querySelector('.selected-option');
      var options: any = document.querySelectorAll('.option');

      selectedOption.addEventListener('click', () => {
        selectedOption.parentElement.classList.toggle('active');
      });

      options.forEach((option: any) => {
        option.addEventListener('click', () => {
          setTimeout(() => {
            selectedOption.innerHTML = option.innerHTML;
            // SET CURRENT REFERENCE VALUE
            setSelectedReference(option.innerHTML);
          }, 300);

          selectedOption.parentElement.classList.remove('active');
        });
      });
    };
  }, []);

  const suppliesRequest = () => {
    const correctAmount = parseFloat(amount);
    console.log(Number.isInteger(correctAmount) && correctAmount > 0);
    console.log(selectedReference);
    const inputOption = document.querySelector('.selected-option');
    let enableInput = inputOption?.innerHTML !== 'Seleccionar';
    if (Number.isInteger(correctAmount) && correctAmount > 0 && enableInput) {
      Axios.post(dbSuppliesURL, {
        actualAmount: amount,
        referenceSelection: selectedReference,
      }).then((response: AxiosResponse): void => {
        if (response.data === 'SUCCESSFUL_REQUEST') {
          dispatch({type: 'SUCCESSFUL_REQUEST'});
        } else {
          dispatch({type: 'INSUFFICIENT_SUPPLIES', payload: response.data});
        }
      });
    } else {
      dispatch({type: 'WRONG_INPUT'});
      refContainer.current.value = '';
    }
  };

  const closeModal = () => {
    dispatch({tpye: 'CLOSE_MODAL'});
  };

  return (
    <div className="general-container-dressmaking">
      <h2 className="general-container-dressmaking__h2">
        Taller de confección
      </h2>
      <p className="general-container-dressmaking__p">
        ¡Hola!, ¿qué insumos quieres pedir hoy?
      </p>
      <div className="external_options_container">
        <div className="options_container">
          <div className="select_box_center-reference">
            <div className="references-container">
              <div className="title">Seleccione la referencia:</div>
              <div className="select-container">
                <p className="selected-option">Seleccionar</p>
                <ul className="options-container">
                  {references.map((reference: IReference) => {
                    return <li className="option">{reference.referencia}</li>;
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
          </div>
          {/* <label htmlFor='acualAmout' className="amount_label">Cantidad: </label> */}
          <div className="select_box_center-button">
            <button className="btn" type="button" onClick={suppliesRequest}>
              Enviar
            </button>
          </div>
        </div>
      </div>
      {state.isModalOpen && (
        <SuccessfulModalDressMaking
          modalContent={state.modalContent}
          closeModal={closeModal}
          checkNumber={state.checkNumber}
        />
      )}
    </div>
  );
};

export default DressMaking;
