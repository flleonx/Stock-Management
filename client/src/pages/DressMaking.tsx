import React, { useState, useEffect, useReducer, useRef } from "react";
import Axios, { AxiosResponse } from "axios";
import SuccessfulModalDressMaking from "../components/dressmaking/SuccessfulModalDressMaking";
// REDUCER
import { reducer } from "../components/dressmaking/ReducerDressMaking";
import "../components/dressmaking/style/buttonStyle.css";

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
  const [amount, setAmount] = useState<string>("");
  const [selectedReference, setSelectedReference] = useState<string>("");
  const dbReferencesURL: string = "http://localhost:10000/api/references";
  const dbSuppliesURL: string = "http://localhost:10000/api/suppliesrequest";
  const [state, dispatch] = useReducer(reducer, defaultState);
  const refContainer: any = useRef(null);

  // HANDLE AMOUNT INPUT
  const handleInput = (input: any) => {
    setAmount(input);
    if (input.includes(".") || input.includes("-") || input.includes("!")) {
      const amountInputHTML: any = document.getElementById("amountInput");
      amountInputHTML.value = "";
      // refContainer.current.value = "";
      setAmount("");
    }
  };

  // GET REFERENCES
  useEffect(() => {
    Axios.get(dbReferencesURL).then((response: AxiosResponse) => {
      setReferences(response.data);
    });
  }, []);

  const suppliesRequest = () => {
    const correctAmount = parseFloat(amount);
    console.log(Number.isInteger(correctAmount) && correctAmount > 0);
    console.log(correctAmount);
    if (Number.isInteger(correctAmount) && correctAmount > 0) {
      Axios.post(dbSuppliesURL, {
        actualAmount: amount,
        referenceSelection: selectedReference,
      }).then((response: AxiosResponse): void => {
        if (response.data === "SUCCESSFUL_REQUEST") {
          dispatch({ type: "SUCCESSFUL_REQUEST" });
        } else {
          dispatch({ type: "INSUFFICIENT_SUPPLIES", payload: response.data });
        }
      });
    } else {
      dispatch({ type: "WRONG_INPUT" });
      refContainer.current.value = "";
    }
  };

  const closeModal = () => {
    dispatch({ tpye: "CLOSE_MODAL" });
  };

  return (
    <>
      <h1>Taller de confección</h1>
      <select
        name="referenceSelection"
        onChange={(e: any) => {
          setSelectedReference(e.target.value);
        }}
      >
        <option value="0">Seleccione la referencia</option>
        {references.map((reference: IReference) => {
          return (
            <option key={reference.referencia} value={reference.referencia}>
              {reference.referencia}
            </option>
          );
        })}
      </select>
      <label>Cantidad: </label>
      <input
        ref={refContainer}
        name="actualAmount"
        type="number"
        autoComplete="off"
        onChange={(e) => {
          setAmount(e.target.value);
        }}
      />
        <button className="btn" type="button" onClick={suppliesRequest}>
          Enviar
        </button>
      {state.isModalOpen && (
        <SuccessfulModalDressMaking
          modalContent={state.modalContent}
          closeModal={closeModal}
          checkNumber={state.checkNumber}
        />
      )}
    </>
  );
};

export default DressMaking;
