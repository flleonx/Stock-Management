import React, {useState, useEffect, useReducer, useRef} from 'react';
import Axios, {AxiosResponse} from 'axios';
import SuccessfulModalDressMaking from '../components/dressmaking/SuccessfulModalDressMaking';
// REDUCER
import {reducer} from '../components/dressmaking/ReducerDressMaking';
// import './style/DressMaking.css';
// import '../components/dressmaking/style/buttonStyle.css';
import {baseURL} from '../components/app/baseURL';
import Modal from '../components/Modal';
import completeImage from '../assets/complete.svg';
import errorImage from '../assets/error.svg';
import {StringLiteralLike, updateSourceFile} from 'typescript';
import './style/WareHouseProducts.css';
import ModalWarehouseProductsReq from '../components/warehouseProducts/ModalWarehouseProductsReq';

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
  const [shopRequestInfo, setShopRequestInfo] = useState<any>([]);
  const [actualShopRequests, setActualShopRequest] = useState<IShopRequests[]>(
    []
  );
  const [reference, setReference] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isOpenModalReq, setIsOpenModalReq] = useState<boolean>(false);
  const [checkReqNumber, setCheckReqNumber] = useState<number>(0);
  const [indexModal, setIndexModal] = useState<number>(0);

  const dbWareHouseProducts: string = baseURL + 'api/getwarehouseproducts';
  const dbShopsRequestProducts: string = baseURL + 'api/shoprequestproducts';
  const dbAcceptShopRequest: string = baseURL + 'api/acceptshoprequest';
  const dbActualShopsRequests: string = baseURL + 'api/getactualshoprequests';
  const dbSaveDecision: string = baseURL + 'api/savewarehouseproductsdecision';

  useEffect(() => {
    Axios.get(dbWareHouseProducts).then((response: AxiosResponse) => {
      setWareHouseProducts(response.data);
    });

    Axios.get(dbActualShopsRequests).then((response: AxiosResponse) => {
      setActualShopRequest(response.data);
    });
  }, []);

  const handlerShowInfo = (index: number) => {
    console.log(actualShopRequests[index]);
    Axios.post(dbShopsRequestProducts, {
      reference: actualShopRequests[index].referencia,
      amount: actualShopRequests[index].cantidad,
    }).then((response: AxiosResponse) => {
      console.log(response.data);
      if (Number.isInteger(Number(response.data))) {
        console.log('No hay suficientes se necesitan: ', response.data);
        const insufficientInfo = [
          {
            referencia: actualShopRequests[index].referencia.toString(),
            cantidad: response.data.toString(),
          },
        ];
        setShopRequestInfo(insufficientInfo);
        setCheckReqNumber(2);
        setIndexModal(index);
        setIsOpenModalReq(true);
      } else if (response.data === 'NO EXISTE') {
        console.log('NO EXISTE REGISTRO');
        setCheckReqNumber(3);
        setIndexModal(index);
        setIsOpenModalReq(true);
      } else {
        setShopRequestInfo(response.data);
        setCheckReqNumber(1);
        setIndexModal(index);
        setIsOpenModalReq(true);
      }
    });
  };

  const handlerApprove = (payload: any) => {
    let index = payload;
    console.log(shopRequestInfo);
    console.log(shopRequestInfo);
    // dispatch({ type: "SUCCESSFUL_REQUEST" });
    console.log('TODO NICE');
    Axios.post(dbSaveDecision, {
      ...actualShopRequests[index],
      neededStock: shopRequestInfo,
      idDecision: 1,
    }).then((response: AxiosResponse): void => {
      console.log(response.data);
    });
    let filterResult = actualShopRequests.filter(
      (item: IShopRequests) =>
        item.numero_de_orden != actualShopRequests[index].numero_de_orden
    );
    setActualShopRequest(filterResult);
  };

  const handlerRefuse = (payload: any) => {
    let index = payload;
    console.log(actualShopRequests[index]);
    console.log(index);
    Axios.post(dbSaveDecision, {
      ...actualShopRequests[index],
      idDecision: 0,
    }).then((response: AxiosResponse): void => {
      if (response.data === 'SUCCESSFUL_SAVING') {
        console.log('TODO NICE');
        let filterResult = actualShopRequests.filter(
          (item: IShopRequests) =>
            item.numero_de_orden !== actualShopRequests[index].numero_de_orden
        );
        setActualShopRequest(filterResult);
      } else {
        console.log('BARRILETE');
      }
    });

    // setDressMakingReq(dressMakingReq.splice[index])
  };

  const closeModal = () => {
    setIsOpenModalReq(false);
  };

  return (
    <div className="general-container-warehouseproducts">
      <h2 className="general-container-warehouseproducts__h2">
        Bodega productos
      </h2>
      <p className="general-container-warehouseproducts__p">
        Aquí en Bodega productos puedes ver los productos producidos y aceptar
        peticiones de tiendas.
      </p>
      <h3 className="general-container-warehouseproducts__h3">
        Productos producidos
      </h3>
      <div className="productsContainer">
        {wareHouseProducts.map((item) => {
          return (
            <div className="productCard">
              <h4 className="productCard__h4"> Información del producto</h4>
              <div className="productCard__lot">
                Numero de Lote: {item.numero_lote}
              </div>
              <div className="productCard__reference">
                Referencia: {item.referencia}
              </div>
              <div className="productCard__Order">
                # de orden: {item.numero_de_orden}
              </div>
              <div className="productCard__amount">
                Cantidad: {item.cantidad}
              </div>
              <div className="productCard__date">
                Fecha: {item.timestamp.replace('T', ' ').slice(0, 16)}
              </div>
            </div>
          );
        })}
      </div>
      <h3 className="general-container-warehouseproducts__h3">
        Estas son las peticiones activas
      </h3>
      <div className="shopsRequestContainer">
        {actualShopRequests.map((shop, index) => {
          return (
            <div className="shopRequestCard">
              <h4 className="shopRequestCard__h4">
                Información de la petición
              </h4>
              <div className="shopRequestCard__order">
                # de orden: {shop.numero_de_orden}
              </div>
              <div className="shopRequestCard__reference">
                Referencia: {shop.referencia}
              </div>
              <div className="shopRequestCard__amount">
                Cantidad: {shop.cantidad}
              </div>
              <div className="shopRequestCard__shop">
                Tienda: {shop.nombre_tienda}
              </div>
              <div className="shopRequestCard_date">
                Fecha: {shop.timestamp.replace('T', ' ').slice(0, 16)}
              </div>
              <div className="shopRequestCard__address">
                Dirección: {shop.direccion ? shop.direccion : '0'}
              </div>
              <button
                className="btn shopRequestCard__deploy"
                key={index}
                data-index={index}
                // onClick={() => setIsOpenModalReq(true)}
                onClick={() => handlerShowInfo(index)}
              >
                Desplegar requerimientos
              </button>
              {/* <button
                className="btn shopRequestCard__refuse"
                key={index + Math.random()}
                data-index={index}
                onClick={() => handlerRefuse(index)}
              >
                Rechazar
              </button>
              <button
                className="btn shopRequestCard__approve"
                key={index + Math.random()}
                data-index={index}
                onClick={() => handlerApprove(index)}
              >
                Aceptar
              </button> */}
            </div>
          );
        })}
      </div>
      {/* <div>PARA CUMPLIR EL PEDIDO SE NECESITAN:</div>
      {shopRequestInfo.map((item) => {
        return (
          <div>
            <div>Numero de Lote: {item.numero_lote}</div>
            <div>Referencia: {item.referencia}</div>
            <div>Cantidad: {item.cantidad}</div>
            <div>Fecha: {item.timestamp.replace('T', ' ').slice(0, 16)}</div>
            <div>Restante: {item.restante ? item.restante : '0'}</div>
          </div>
        );
      })} */}
      <ModalWarehouseProductsReq
        isOpen={isOpenModalReq}
        closeModal={closeModal}
        infoReq={shopRequestInfo}
        checkReqNumber={checkReqNumber}
        handlerRefuse={handlerRefuse}
        handlerAccept={handlerApprove}
        index={indexModal}
      />
    </div>
  );
};

export default WareHouseProducts;
