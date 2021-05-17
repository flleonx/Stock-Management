import React, { useState, useEffect, useReducer, useRef } from "react";
import Axios, { AxiosResponse } from "axios";
import SuccessfulModalDressMaking from "../components/dressmaking/SuccessfulModalDressMaking";
// REDUCER
import { reducer } from "../components/dressmaking/ReducerDressMaking";
import "./style/DressMaking.css";
import "../components/dressmaking/style/buttonStyle.css";
import { baseURL } from "../components/app/baseURL";
import Modal from "../components/Modal";
import completeImage from "../assets/complete.svg";
import errorImage from "../assets/error.svg";
import noDataImage from "../assets/no-data.svg";
import { updateSourceFile } from "typescript";
import ModalAreYouSureDressmaking from "../components/dressmaking/ModalAreYouSureDressmaking";
import FilterDropdown from "../components/FilterDropdown";

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
  const [amount, setAmount] = useState<string>("");
  const [selectedReference, setSelectedReference] = useState<string>("");
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [approvedRequests, setApprovedRequests] = useState<any>([]);
  const [requestsHistory, setRequestsHistory] = useState<any>([]);
  const [numberInput, setNumberInput] = useState<string>("");
  const refContainer: any = useRef(null);
  const [isOpenARYModal, setIsOpenARYModal] = useState<boolean>(false);
  const [infoProcess, setInfoProcess] = useState<any>({});
  const [valueReferenceSelect, setValueReferenceSelect] = useState<any>(null);
  const [toggleState, setToggleState] = useState(1);
  const dbReferencesURL: string = baseURL + "api/references";
  const dbSuppliesURL: string = baseURL + "api/suppliesrequest";
  const dbWareHouseRequest: string = baseURL + "api/requesttowarehouse";
  const dbApprovedRequests: string = baseURL + "api/getapprovedrequests";
  const dbUpdateDressMakingProcess: string =
    baseURL + "api/updatedressmakingprocess";
  const dbRequestHistoryDressmaking: string =
    baseURL + "api/getRequestHistoryDressmaking";

  // HANDLE AMOUNT INPUT
  const handleInput = (input: any) => {
    setAmount(input);
    if (input.includes(".") || input.includes("-") || input.includes("!")) {
      const amountInputHTML: any = document.getElementById("amountInput");
      amountInputHTML.value = "";
      setAmount("");
    }
  };

  // GET REFERENCES
  useEffect(() => {
    Axios.get(dbReferencesURL).then((response: AxiosResponse) => {
      setReferences(response.data);
    });

    Axios.get(dbApprovedRequests).then((response: AxiosResponse) => {
      setApprovedRequests(response.data);
    });

    Axios.get(dbRequestHistoryDressmaking).then((response: AxiosResponse) => {
      setRequestsHistory(response.data);
    });
  }, []);

  const suppliesRequest = () => {
    let ReferenceSelected = "";
    let isReferenceExist = 0;
    const correctAmount = parseFloat(amount);

    if (valueReferenceSelect === null) {
      ReferenceSelected = "";
    } else if (typeof valueReferenceSelect === "object") {
      ReferenceSelected = valueReferenceSelect.referencia.toString();
    } else if (typeof valueReferenceSelect === "string") {
      ReferenceSelected = valueReferenceSelect;
    }

    references.map((val: any) => {
      if (val.referencia === parseFloat(ReferenceSelected)) {
        isReferenceExist += 1;
        return isReferenceExist;
      } else {
        return isReferenceExist;
      }
    });

    let enableInput = ReferenceSelected !== "";
    if (Number.isInteger(correctAmount) && correctAmount > 0 && enableInput) {
      if (isReferenceExist === 1) {
        Axios.post(dbWareHouseRequest, {
          actualAmount: amount,
          referenceSelection: ReferenceSelected,
        }).then((response: AxiosResponse): void => {
          if (response.data === "SUCCESSFUL_REQUEST") {
            setAmount("");
            setValueReferenceSelect(null);
            refContainer.current.value = "";
            dispatch({ type: "SUCCESSFUL_REQUEST" });
          } else {
            dispatch({ type: "INSUFFICIENT_SUPPLIES", payload: response.data });
          }
        });
      } else {
        dispatch({ type: "REFERENCE_DOES_NOT_EXIST" });
      }
    } else {
      dispatch({ type: "WRONG_INPUT" });
      refContainer.current.value = "";
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
        dispatch({ type: "DIFF_NEGATIVE" });
      }
    } else {
      setIsOpenARYModal(false);
      dispatch({ type: "WRONG_INPUT_PROCESS" });
    }
  };

  const handlerSubtract = () => {
    let diff = infoProcess.amount - infoProcess.valueInput;
    infoProcess.HTMLElement.value = "";
    Axios.post(dbUpdateDressMakingProcess, {
      referencia: infoProcess.reference,
      id: infoProcess.id,
      diff,
      amount: infoProcess.valueInput,
    }).then((response: AxiosResponse) => {

      infoProcess.valueInput = null;
      Axios.get(dbApprovedRequests).then((response: AxiosResponse) => {
        setApprovedRequests(response.data);
      });
    });
  };

  const closeModal = () => {
    setIsOpenARYModal(false);
    dispatch({ type: "CLOSE_MODAL" });
  };

  const handleNavbarClick = (e: any) => {
    e.preventDefault();
    const target = e.target.getAttribute("href");
    const location = document.querySelector(target).offsetTop;
    const scrollDiv = document.getElementById(
      "scroll-dressmaking"
    ) as HTMLDivElement;

    scrollDiv.scrollTo(0, location - 55);
  };

  const toggleTab = (index: number) => {
    setToggleState(index);
  };

  return (
    <div className="general-container-dressmaking">
      <div className="navbar-dressmaking">
        <h2 className="navbar-dressmaking__h2">Taller confección</h2>
        <div className="navbar-dressmaking-otpions">
          <div
            className={
              toggleState === 1
                ? "tabs-dressmaking active-tabs-dressmaking"
                : "tabs-dressmaking"
            }
            onClick={() => toggleTab(1)}
          >
            <a href="#ressmaking-request-container" onClick={handleNavbarClick}>
              Enviar petición
            </a>
          </div>
          <div
            className={
              toggleState === 2
                ? "tabs-dressmaking active-tabs-dressmaking"
                : "tabs-dressmaking"
            }
            onClick={() => toggleTab(2)}
          >
            <a
              href="#dressmaking-process-container"
              onClick={handleNavbarClick}
            >
              Artículos en proceso
            </a>
          </div>
          <div
            className={
              toggleState === 3
                ? "tabs-dressmaking active-tabs-dressmaking"
                : "tabs-dressmaking"
            }
            onClick={() => toggleTab(3)}
          >
            <a href="#requests-history-section" onClick={handleNavbarClick}>
              Historial de peticiones
            </a>
          </div>
        </div>
      </div>
      <div className="scroll-dressmaking-section" id="scroll-dressmaking">
        <div
          className="dressmaking-request-container"
          id="ressmaking-request-container"
        >
          <div className="dressmaking-request-card">
            <div className="dressmaking-request-card__h2">
              Enviar petición a Bodega Insumos
            </div>
            <div className="dressmaking-request-form">
              <div className="filter-dropdown-request-dressmaking">
                <FilterDropdown
                  options={references}
                  id="referencia"
                  label="referencia"
                  prompt="Seleccionar referencia"
                  value={valueReferenceSelect}
                  onChange={(val: any) => setValueReferenceSelect(val)}
                />
              </div>
              <input
                ref={refContainer}
                id="actualAmount"
                name="actualAmount"
                className="actualAmount"
                placeholder="cantidad"
                type="number"
                value={amount}
                autoComplete="off"
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
              <button className="btn" type="button" onClick={suppliesRequest}>
                Enviar
              </button>
            </div>
          </div>

          <div className="information-dressmaking-request-container">
            <h2 className="information-dressmaking-request-container__h2">
              Enviar petición a Bodega Insumos
            </h2>
            <p className="information-dressmaking-request-container__p">
              ¿Necesitas confeccionar un nuevo artículo? Entonces envía una
              petición a Bodega Insumos para obtener los insumos necesarios para
              confeccionar este artículo. Para esto solo escoge la referencia
              del artículo que quieres hacer, cuantos artículos quieres realizar
              y preciona el botón enviar. Así de fácil :)
            </p>
          </div>
        </div>
        <div
          className="dressmaking-process-container"
          id="dressmaking-process-container"
        >
          <h3>Artículos en proceso</h3>
          <p>
            En este apartado se muestra los artículos que se están produciendo.
            Puedes ir descontando la cantidad en proceso de los artículos a
            medida que los vas produciendo. Solo digita la cantidad producida y
            presiona aceptar.{" "}
          </p>
          {approvedRequests.length == 0 && (
            <>
              <div className="no-data-image-approved-req-dressmaking-container">
                <img
                  src={noDataImage}
                  alt="no-data"
                  className="no-data-image-approved-req-dressmaking-container__img"
                />
              </div>
              <p className="no-data-image-approved-req-dressmaking-paragraph">
                Aún no hay artículos en proceso
              </p>
            </>
          )}
          {approvedRequests.length !== 0 && (
            <div className="approved-requests-dressmaking-container">
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
                      Fecha: {item.timestamp.replace("T", " ").slice(0, 16)}
                    </div>
                    <input
                      className={"h" + item.id}
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
                          document.querySelector(".h" + item.id)
                        );
                      }}
                    >
                      Aceptar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="requests-history-section" id="requests-history-section">
          <h3>Historial de peticiones</h3>
          <p>
            Aquí se despliega el historial de peticiones realizadas de taller
            confección a bodega insumos.
          </p>
          <div className="requets-history-dressmaking-container">
            <div className="label-history-request-dressmanking">
              <div className="label-history-request-dressmanking__number-of-order">
                Número de orden
              </div>
              <div className="label-history-request-dressmanking__reference">
                Referencia
              </div>
              <div className="label-history-request-dressmanking__amount">
                Cantidad
              </div>
              <div className="label-history-request-dressmanking__decision">
                Decisión
              </div>
              <div className="label-history-request-dressmanking__timestamp">
                Fecha
              </div>
            </div>
            {requestsHistory.map((request: any) => {
              return (
                <div className="request-card-container">
                  <div className="request-card-container__order">
                    {request.numero_de_orden}
                  </div>
                  <div className="request-card-container__reference">
                    {request.referencia}
                  </div>
                  <div className="request-card-container__amount">
                    {request.cantidad}
                  </div>
                  <div className="request-card-container__decision">
                    {request.decision}
                  </div>
                  <div className="request-card-container__date">
                    {" "}
                    {request.timestamp.replace("T", " ").slice(0, 16)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
