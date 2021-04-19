import React, { useState, useEffect, useReducer, useRef } from "react";
import Axios, { AxiosResponse } from "axios";
import SuccessfulModalDressMaking from "../components/dressmaking/SuccessfulModalDressMaking";
// REDUCER
import { reducer } from "../components/dressmaking/ReducerDressMaking";
// import './style/DressMaking.css';
// import '../components/dressmaking/style/buttonStyle.css';
import { baseURL } from "../components/app/baseURL";
import Modal from "../components/Modal";
import completeImage from "../assets/complete.svg";
import errorImage from "../assets/error.svg";
import { StringLiteralLike, updateSourceFile } from "typescript";

const WareHouseProducts = () => {
  //INTERFACES
  interface IWareHouseProducts {
    numero_lote: string;
    referencia: string;
    numero_de_orden: string;
    cantidad: string;
    timestamp: string;
    restante?: string;
  }

  interface IShopRequests {
    numero_de_orden: number;
    referencia: number;
    cantidad: number;
    idTienda: number;
    timestamp: string;
    nombre_tienda: string;
    direccion: string;
  }

  // STATES STATEMENTS
  const [wareHouseProducts, setWareHouseProducts] = useState<
    IWareHouseProducts[]
  >([]);
  const [shopRequestInfo, setShopRequestInfo] = useState<IWareHouseProducts[]>(
    []
  );
  const [actualShopRequests, setActualShopRequest] = useState<IShopRequests[]>(
    []
  );
  const [reference, setReference] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const dbWareHouseProducts: string = baseURL + "api/getwarehouseproducts";
  const dbShopsRequestProducts: string = baseURL + "api/shoprequestproducts";
  const dbAcceptShopRequest: string = baseURL + "api/acceptshoprequest";
  const dbActualShopsRequests: string = baseURL + "api/getactualshoprequests";

  useEffect(() => {
    Axios.get(dbWareHouseProducts).then((response: AxiosResponse) => {
      setWareHouseProducts(response.data);
    });

    Axios.get(dbActualShopsRequests).then((response: AxiosResponse) => {
      setActualShopRequest(response.data);
    });
  }, []);

  const handlerShowInfo = (index: number) => {
    Axios.post(dbShopsRequestProducts, {
      reference: actualShopRequests[index].referencia,
      amount: actualShopRequests[index].cantidad,
    }).then((response: AxiosResponse) => {
      console.log(response.data)
      if (Number.isInteger(Number(response.data))) {
        console.log("No hay suficientes se necesitan: ", response.data);
      } else if ((response.data === "NO EXISTE")) {
        console.log("NO EXISTE REGISTRO");
      } else {
        setShopRequestInfo(response.data);
      }
    });
  };

  return (
    <div>
      {wareHouseProducts.map((item) => {
        return (
          <div>
            <div>Numero de Lote: {item.numero_lote}</div>
            <div>Referencia: {item.referencia}</div>
            <div># de orden: {item.numero_de_orden}</div>
            <div>Cantidad: {item.cantidad}</div>
            <div>Fecha: {item.timestamp.replace("T", " ").slice(0, 16)}</div>
          </div>
        );
      })}
      <div>ESTAS SON LAS PETICIONES ACTIVAS</div>
      {actualShopRequests.map((shop, index) => {
        return (
          <div>
            <div># de orden: {shop.numero_de_orden}</div>
            <div>Referencia: {shop.referencia}</div>
            <div>Cantidad: {shop.cantidad}</div>
            <div>Tienda: {shop.nombre_tienda}</div>
            <div>Fecha: {shop.timestamp.replace("T", " ").slice(0, 16)}</div>
            <div>Dirección: {shop.direccion ? shop.direccion : "0"}</div>
            <button
              className="btn"
              key={index}
              data-index={index}
              onClick={() => handlerShowInfo(index)}
            ></button>
          </div>
        );
      })}
      <div>PARA CUMPLIR EL PEDIDO SE NECESITAN:</div>
      {shopRequestInfo.map((item) => {
        return (
          <div>
            <div>Numero de Lote: {item.numero_lote}</div>
            <div>Referencia: {item.referencia}</div>
            <div>Cantidad: {item.cantidad}</div>
            <div>Fecha: {item.timestamp.replace("T", " ").slice(0, 16)}</div>
            <div>Restante: {item.restante ? item.restante : "0"}</div>
          </div>
        );
      })}
    </div>
  );
};

export default WareHouseProducts;
