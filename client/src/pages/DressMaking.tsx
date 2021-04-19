import React, {useState, useEffect, useReducer, useRef} from 'react';
import Axios, {AxiosResponse} from 'axios';
import SuccessfulModalDressMaking from '../components/dressmaking/SuccessfulModalDressMaking';
// REDUCER
import {reducer} from '../components/dressmaking/ReducerDressMaking';
import './style/DressMaking.css';
import '../components/dressmaking/style/buttonStyle.css';
import {baseURL} from '../components/app/baseURL';
import Modal from '../components/Modal';
import completeImage from '../assets/complete.svg';
import errorImage from '../assets/error.svg';
import {updateSourceFile} from 'typescript';
import ModalAreYouSureDressmaking from '../components/dressmaking/ModalAreYouSureDressmaking';

// INTERFACES
interface IReference {
  referencia: number;
  id_talla: number;
  descripcion: string;
  color: string;
  nombre_imagen: string;
  codigoycantidad: string;
}

const defaultState: any = {
  modalContent: [],
  isModalOpen: false,
  isInsufficientModalOpen: false,
  checkNumber: 0,
  imgCheckNumber: 0,
};

const DressMaking: React.FC = () => {
  const [references, setReferences] = useState<IReference[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [selectedReference, setSelectedReference] = useState<string>('');
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [approvedRequests, setApprovedRequests] = useState<any>([]);
  const [numberInput, setNumberInput] = useState<string>('');
  const refContainer: any = useRef(null);
  const [isOpenARYModal, setIsOpenARYModal] = useState<boolean>(false);
  const [infoProcess, setInfoProcess] = useState<any>({});
  const dbReferencesURL: string = baseURL + 'api/references';
  const dbSuppliesURL: string = baseURL + 'api/suppliesrequest';
  const dbWareHouseRequest: string = baseURL + 'api/requesttowarehouse';
  const dbApprovedRequests: string = baseURL + 'api/getapprovedrequests';
  const dbUpdateDressMakingProcess: string =
    baseURL + 'api/updatedressmakingprocess';

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

    Axios.get(dbApprovedRequests).then((response: AxiosResponse) => {
      setApprovedRequests(response.data);
    });

    const triggerListeners = () => {
      var selectedOption: any = document.querySelector(
        '.selected-option-dressmaking'
      );
      var options: any = document.querySelectorAll('.option');

      selectedOption.addEventListener('click', () => {
        selectedOption.parentElement.classList.toggle('active');
      });

      options.forEach((option: any) => {
        option.addEventListener('click', () => {
          setTimeout(() => {
            selectedOption.innerHTML = option.innerHTML;
            // SET CURRENT REFERENCE VALUE
            console.log(option);
            setSelectedReference(option.innerHTML);
          }, 300);

          selectedOption.parentElement.classList.remove('active');
        });
      });
    };
  }, []);

  const suppliesRequest = () => {
    const correctAmount = parseFloat(amount);
    const inputOption = document.querySelector(
      '.selected-option-dressmaking'
    ) as HTMLParagraphElement;
    console.log(Number.isInteger(correctAmount));
    console.log(correctAmount > 0);
    let enableInput = inputOption?.innerHTML !== 'Seleccionar';
    if (Number.isInteger(correctAmount) && correctAmount > 0 && enableInput) {
      Axios.post(dbWareHouseRequest, {
        actualAmount: amount,
        referenceSelection: selectedReference,
      }).then((response: AxiosResponse): void => {
        if (response.data === 'SUCCESSFUL_REQUEST') {
          setAmount('');
          inputOption.innerHTML = 'Seleccionar';
          refContainer.current.value = '';
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

  const verificationARYModal = (
    referencia: any,
    id: any,
    amount: any,
    HTMLElement: any
  ) => {
    const valueInput = parseFloat(HTMLElement.value);
    const inputCondition = valueInput > 0 && Number.isInteger(valueInput);
    if (inputCondition) {
      let diff = parseFloat(amount) - valueInput;
      console.log(diff);
      if (diff >= 0) {
        setIsOpenARYModal(true);
        setInfoProcess({
          reference: referencia,
          id,
          amount,
          valueInput,
          HTMLElement,
        });
      } else {
        dispatch({type: 'DIFF_NEGATIVE'});
      }
    } else {
      setIsOpenARYModal(false);
      dispatch({type: 'WRONG_INPUT_PROCESS'});
    }
  };

  const handlerSubtract = () => {
    let diff = infoProcess.amount - infoProcess.valueInput;
    infoProcess.HTMLElement.value = '';
    Axios.post(dbUpdateDressMakingProcess, {
      referencia: infoProcess.reference,
      id: infoProcess.id,
      diff,
      amount: infoProcess.valueInput,
    }).then((response: AxiosResponse) => {
      console.log(response.data);

      infoProcess.valueInput = null;
      Axios.get(dbApprovedRequests).then((response: AxiosResponse) => {
        setApprovedRequests(response.data);
      });
    });
  };

  const closeModal = () => {
    setIsOpenARYModal(false);
    dispatch({type: 'CLOSE_MODAL'});
  };

  return (
    <div className="general-container-dressmaking">
      <h2 className="general-container-dressmaking__h2">
        Taller de confección
      </h2>
      <p className="general-container-dressmaking__p">
        ¡Hola!, Aquí puedes digitar la cantidad a producir de una o varias
        referencias.
      </p>
      <div className="external_options_container">
        <div className="options_container">
          <div className="select_box_center-reference">
            <div className="references-container">
              <div className="title">Seleccione la referencia:</div>
              <div className="select-container">
                <p className="selected-option-dressmaking">Seleccionar</p>
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
              value={amount}
              autoComplete="off"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </div>
          <div className="select_box_center-button">
            <button className="btn" type="button" onClick={suppliesRequest}>
              Enviar
            </button>
          </div>
        </div>
      </div>
      <div className="dressMakingReqProcessContainer">
        {approvedRequests.map((item: any) => {
          return (
            <div className="requestDressmakingContainer">
              <h4 className="requestDressmakingContainer__h4">
                Referencia en proceso
              </h4>
              <div className="requestDressmakingContainer__reference">
                Petición: #{item.id}
              </div>
              <div className="requestDressmakingContainer__reference">
                Referencia: {item.referencia}
              </div>
              <div className="requestDressmakingContainer__amount">
                Cantidad en proceso: {item.cantidad}
              </div>
              <div className="requestDressmakingContainer__timestamp">
                Fecha: {item.timestamp.replace('T', ' ').slice(0, 16)}
              </div>
              <input
                className={'h' + item.id}
                id="requestDressmakingContainer__amountInput"
                type="number"
                placeholder="Digite la cantidad terminada"
              />
              <button
                className="btn requestDressmakingContainer__accept"
                onClick={() => {
                  verificationARYModal(
                    item.referencia,
                    item.id,
                    item.cantidad,
                    document.querySelector('.h' + item.id)
                  );
                }}
              >
                Aceptar
              </button>
            </div>
          );
        })}
      </div>
      {state.isInsufficientModalOpen && (
        <SuccessfulModalDressMaking
          modalContent={state.modalContent}
          closeModal={closeModal}
          checkNumber={state.checkNumber}
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
      <ModalAreYouSureDressmaking
        isOpen={isOpenARYModal}
        closeModal={closeModal}
        subAmountFunction={handlerSubtract}
      />
    </div>
  );
};

export default DressMaking;
