import React, { useState, useEffect } from "react";
import Axios, { AxiosResponse } from "axios";
import { withRouter } from "react-router-dom";

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

const Design = () => {
  const dbWareHouseCodesURL: string =
    "http://localhost:10000/api/warehousecodes";
  const dbSaveNewReference: string =
    "http://localhost:10000/api/savenewreference";
  const [dBWareHouseSupplies, setdBWareHouseSupplies] = useState<
    IWareHouseSupplies[]
  >([]);
  const [addReference, setAddReference] = useState<string>("");
  const [addTalla, setAddTalla] = useState<string>("");
  const [addDescription, setAddDescription] = useState<string>("");
  const [addColor, setAddColor] = useState<string>("");
  const [addImageName, setAddImageName] = useState<string>("");
  const [inputAmount, setInputAmount] = useState<string>("");
  const [addedInformation, setAddedInformation] = useState<
    ISupplyInformation[]
  >([]);

  useEffect(() => {
    Axios.get(dbWareHouseCodesURL).then((response: AxiosResponse) => {
      setdBWareHouseSupplies(response.data);
      console.log(response.data);
      triggerListeners();
    });
    const triggerListeners = () => {
      var selectedOption: any = document.querySelector(".selected-option");
      var options: any = document.querySelectorAll(".option");

      selectedOption.addEventListener("click", () => {
        selectedOption.parentElement.classList.toggle("active");
      });

      options.forEach((option: any) => {
        option.addEventListener("click", () => {
          setTimeout(() => {
            selectedOption.innerHTML = option.innerHTML;
            // SET CURRENT REFERENCE VALUE
            // setSelectedReference(option.innerHTML);
          }, 300);

          selectedOption.parentElement.classList.remove("active");
        });
      });
    };
  }, []);

  const handlerAddSupplies = () => {
    var selectedOption: any = document.querySelector(".selected-option");
    var amountHTML: any = document.querySelector(".amountInput");
    let informationObject: ISupplyInformation = {
      supplyCode: selectedOption.innerHTML,
      supplyAmount: inputAmount,
    };
    setAddedInformation([...addedInformation, informationObject]);

    // SET EMPTY VALUES
    amountHTML.value = null;
    selectedOption.innerHTML = "";
  };

  const handlerSaveNewReference = () => {
    Axios.post(dbSaveNewReference, {
      addReference: addReference,
      addTalla: addTalla,
      addDescription: addDescription,
      addColor: addColor,
      addImageName: addImageName,
      addedInformation
    }).then((response: AxiosResponse): void => {
      console.log(response)
    });
  };

  return (
    <div>
      <h1>Taller diseño</h1>

      <input
        type="text"
        onChange={(e) => setAddReference(e.target.value)}
      ></input>
      <div className="references-container">
        <div className="title">Seleccionar codigo insumo:</div>
        <div className="select-container">
          <p className="selected-option-talla">Seleccionar</p>
          <ul className="options-container">
            <li className="option">1</li>;<li className="option">2</li>;
            <li className="option">3</li>;<li className="option">4</li>;
          </ul>
        </div>
      </div>
      <input
        type="text"
        onChange={(e) => setAddDescription(e.target.value)}
      ></input>
      <input type="text" onChange={(e) => setAddColor(e.target.value)}></input>
      <input
        type="text"
        onChange={(e) => setAddImageName(e.target.value)}
      ></input>
      <div className="references-container">
        <div className="title">Seleccionar codigo insumo:</div>
        <div className="select-container">
          <p className="selected-option">Seleccionar</p>
          <ul className="options-container">
            {dBWareHouseSupplies.map(
              (suppliesInformation: IWareHouseSupplies) => {
                return <li className="option">{suppliesInformation.codigo}</li>;
              }
            )}
          </ul>
        </div>
      </div>
      <div>Cantidad:</div>
      <input
        className="amountInput"
        type="number"
        onChange={(e) => setInputAmount(e.target.value)}
      ></input>
      <div>
        <button type="button" onClick={handlerAddSupplies}>
          Add
        </button>
      </div>
      {addedInformation.map((item, index) => {
        return (
          <div key={index}>
            Codigo: {item.supplyCode} y Cantidad: {item.supplyAmount}
          </div>
        );
      })}
      <div>
        <button type="button" onClick={handlerSaveNewReference}>
          Guardar
        </button>
      </div>
    </div>
  );
};

export default withRouter(Design);
