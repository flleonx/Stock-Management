import React, {useState, useEffect, useReducer} from 'react';
import {withRouter, Link} from 'react-router-dom';
import Axios, {AxiosResponse} from 'axios';
import './style/Warehouse.css';
import ModalInvetoryWareHouse from '../components/warehouse/ModalInventoryWareHouse';
import {baseURL} from '../components/app/baseURL';
import Modal from '../components/Modal';
import completeImage from '../assets/complete.svg';
import errorImage from '../assets/error.svg';
import noDataImage from '../assets/no-data.svg';
import ModalinsufficientSupplies from '../components/warehouse/ModalinsufficientSupplies';
import ModalDecisionSupplies from '../components/warehouse/ModalDecisionSupplies';
import {reducer} from '../components/warehouse/ReducerWarehouse';
import FilterDropdown from '../components/FilterDropdown';

const defaultState: any = {
  isModalOpen: false,
  isFormModalOpen: false,
  isModalUpdateOpen: false,
  isOpenNoSupplies: false,
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
  const [dressMakingReq, setDressMakingReq] = useState<any>([]);
  const [reRenderUpdate, setReRenderUpdate] = useState<boolean>(false);
  const [infoRequest, setInfoRequest] = useState({});
  const [isOpenDecision, setIsOpenDecision] = useState<boolean>(false);
  const [valueCode, setValueCode] = useState<any>(null);
  const saveClothAPIURL: string = baseURL + 'api/savecloth';
  const invetoryBodegaAPIURL: string = baseURL + 'api/invetorywarehouse';
  const invetoryWareHouseAPIURL: string = baseURL + 'api/invetorywarehouse';
  const updateInventoryWareHouseURL: string =
    baseURL + 'api/updatewarehouseinventory';
  const getDressMakingRequest: string = baseURL + 'api/dressmakingrequest';
  const dbSuppliesURL: string = baseURL + 'api/suppliesrequest';
  const dbSaveDecision: string = baseURL + 'api/savewarehousedecision';

  useEffect(() => {
    Axios.get(invetoryWareHouseAPIURL).then((response: AxiosResponse) => {
      setQueryData(response.data);
      triggerListeners(setType, setUpdateCode);
    });

    Axios.get(getDressMakingRequest).then((response: AxiosResponse) => {
      setDressMakingReq(response.data);
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
            Axios.get(invetoryWareHouseAPIURL).then(
              (response: AxiosResponse) => {
                setQueryData(response.data);
              }
            );
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
    let codeSelected = '';
    let isCodeExist = 0;
    let inputUpdateAmount = document.getElementById(
      'amount-update-inventory'
    ) as HTMLInputElement;

    if (valueCode === null) {
      codeSelected = '';
    } else if (typeof valueCode === 'object') {
      codeSelected = valueCode.codigo.toString();
    } else if (typeof valueCode === 'string') {
      codeSelected = valueCode;
    }

    queryData.map((val: any) => {
      if (val.codigo === parseFloat(codeSelected)) {
        isCodeExist += 1;
        return isCodeExist;
      } else {
        return isCodeExist;
      }
    });

    let enableAmount =
      Number.isInteger(parseInt(updateAmount)) && parseInt(updateAmount) > 0;
    let enableCode = codeSelected !== '';

    if (enableAmount && enableCode) {
      if (isCodeExist === 1) {
        let payloadUpdate = {
          code: codeSelected,
          amount: updateAmount,
        };
        setValueCode(null);
        inputUpdateAmount.value = '';
        Axios.post(updateInventoryWareHouseURL, payloadUpdate).then(
          (response: any) => {
            console.log(response);
            if (response.data == 'SUCCESSFUL_UPDATE') {
              dispatch({type: 'SUCCESSFUL_UPDATE'});
            }
          }
        );
      } else {
        dispatch({type: 'CODE_DOES_NOT_EXIST'});
      }
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

  const handlerApprove = (payload: any) => {
    let index = payload;
    console.log(payload);
    Axios.post(dbSuppliesURL, {
      actualAmount: dressMakingReq[index].cantidad,
      referenceSelection: dressMakingReq[index].referencia,
    }).then((response: AxiosResponse): void => {
      if (response.data === 'SUCCESSFUL_REQUEST') {
        // dispatch({ type: "SUCCESSFUL_REQUEST" });
        console.log('TODO NICE');
        Axios.post(dbSaveDecision, {
          ...dressMakingReq[index],
          idDecision: 1,
        }).then((response: AxiosResponse): void => {
          console.log(response.data);
        });
        let filterResult = dressMakingReq.filter(
          (item: any) => item.id != dressMakingReq[index].id
        );
        setDressMakingReq(filterResult);
      }
      // else {
      //   dispatch({type: 'INSUFFICIENT_SUPPLIES', payload: response.data});
      //   console.log('BARRILETE');
      // }
    });
  };

  const handlerRefuse = (payload: any) => {
    let index = payload;
    console.log(index);
    Axios.post(dbSaveDecision, {
      ...dressMakingReq[index],
      idDecision: 0,
    }).then((response: AxiosResponse): void => {
      if (response.data === 'SUCCESSFUL_SAVING') {
        console.log('TODO NICE');
        let filterResult = dressMakingReq.filter(
          (item: any) => item.id != dressMakingReq[index].id
        );
        setDressMakingReq(filterResult);
      } else {
        console.log('BARRILETE');
      }
    });

    // setDressMakingReq(dressMakingReq.splice[index])
  };

  const handlerDecision = (index: any) => {
    console.log(index);
    console.log(dressMakingReq[index].cantidad);
    console.log(dressMakingReq[index].referencia);
    setInfoRequest({
      index,
      amount: dressMakingReq[index].cantidad,
      reference: dressMakingReq[index].referencia,
    });
    Axios.post(dbSuppliesURL, {
      actualAmount: dressMakingReq[index].cantidad,
      referenceSelection: dressMakingReq[index].referencia,
    }).then((response: AxiosResponse): void => {
      if (response.data === 'SUCCESSFUL_REQUEST') {
        setIsOpenDecision(true);
      } else {
        dispatch({type: 'INSUFFICIENT_SUPPLIES', payload: response.data});
        console.log('BARRILETE');
      }
    });
  };

  const closeModal = () => {
    setIsOpenDecision(false);
    dispatch({tpye: 'CLOSE_MODAL'});
  };

  const handleNavbarClick = (e: any) => {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    const location = document.querySelector(target).offsetTop;
    const scrollDiv = document.getElementById(
      'scroll-warehouse'
    ) as HTMLDivElement;

    scrollDiv.scrollTo(0, location - 108);
  };

  return (
    <div className="general-container-warehouse">
      <div className="navbar-warehouse">
        <h2 className="navbar-warehouse__h2">Bodega Insumos</h2>
        <div className="navbar-warehouse-otpions">
          <a href="#new-supplies-section" onClick={handleNavbarClick}>
            Registrar nuevos insumos / Inventarios
          </a>
          <a href="#update-section" onClick={handleNavbarClick}>
            Actualizar insumos existentes
          </a>
          <a href="#request-section" onClick={handleNavbarClick}>
            Peticiones
          </a>
        </div>
      </div>
      <div className="scroll-warehouse" id="scroll-warehouse">
        <div className="body-warehouse-information" id="new-supplies-section">
          <div className="warehouse-form-container">
            <form className="warehouse-form">
              <h2>Registrar nuevos insumos</h2>
              <div className="border-div"></div>
              <input
                type="text"
                id="codigo"
                placeholder="Código"
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
                <p className="selected-option-bodega">
                  Seleccionar tela o insumo
                </p>
                <ul className="options-container-bodega">
                  <li className="option-bodega">Tela</li>
                  <li className="option-bodega">Insumo</li>
                </ul>
              </div>
              <button className="btn" onClick={handleSubmit}>
                Enviar
              </button>
            </form>
          </div>
          <div className="inventory-warehouse-open-modal">
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
        </div>

        <div className="update-container" id="update-section">
          <div className="update-container-card">
            <div className="update-container__h2">
              Actualizar insumos registrados
            </div>
            <div className="update-container-form">
              <div className="filterDropdownUpdateWarehouse">
                <FilterDropdown
                  options={queryData}
                  id="codigo"
                  label="codigo"
                  prompt="Seleccionar código"
                  value={valueCode}
                  onChange={(val: any) => setValueCode(val)}
                />
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

          <div className="information-update-container">
            <h2 className="information-update-container__h2">
              Actualizar cantidad a un insumo registrado
            </h2>
            <p className="information-update-container__p">
              ¿Has recibido más stock de insumos ya registrados en tu
              inventario? En este apartado puedes actualizar estos insumos
              existentes. Solo escoge el codigo, digita la cantidad y presiona
              el botón actualizar. Así de sencillo :)
            </p>
          </div>
        </div>

        <div className="dressMakingReqSection" id="request-section">
          <h3>Peticiones</h3>
          {dressMakingReq.length == 0 && (
            <>
              <div className="no-data-image-warehouse-container">
                <img
                  src={noDataImage}
                  alt="no-data"
                  className="no-data-image-warehouse-container__img"
                />
              </div>
              <p className="no-data-image-warehouse-paragraph">
                Aún no hay peticiones
              </p>
            </>
          )}
          {dressMakingReq.length !== 0 && (
            <div className="dressmakingReqContainer">
              {dressMakingReq.map((req: any, index: any) => {
                return (
                  <div key={index} className="requestWarehouseContainer">
                    <h4 className="requestWarehouseContainer__h4">
                      Petición de taller confección
                    </h4>
                    <div className="requestWarehouseContainer__reference">
                      Referencia: {req.referencia}
                    </div>
                    <div className="requestWarehouseContainer__reference">
                      Cantidad: {req.cantidad}
                    </div>
                    <div className="requestWarehouseDecisionBTNContainer">
                      <button
                        className="btn"
                        onClick={() => {
                          handlerDecision(index);
                        }}
                      >
                        Tomar decisión
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <ModalinsufficientSupplies
          isOpen={state.isOpenNoSupplies}
          closeModal={closeModal}
          arrayNoSupplies={state.modalContent}
          infoRequest={infoRequest}
          handlerReject={handlerRefuse}
        />
        <ModalDecisionSupplies
          isOpen={isOpenDecision}
          closeModal={closeModal}
          infoRequest={infoRequest}
          handlerReject={handlerRefuse}
          handlerAccept={handlerApprove}
        />
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
            <img
              className="modalWarehouseImg"
              src={errorImage}
              alt="modalImg"
            />
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
            <img
              className="modalWarehouseImg"
              src={errorImage}
              alt="modalImg"
            />
          )}
        </Modal>
      </div>
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

  // var selectedCodeUpdateInventory: any = document.querySelector(
  //   '.selected-update-inventory'
  // );
  // var optionsUpdateInventory: any = document.querySelectorAll(
  //   '.option-update-inventory'
  // );

  // selectedCodeUpdateInventory.addEventListener('click', () => {
  //   selectedCodeUpdateInventory.parentElement.classList.toggle('active-bodega');
  // });

  // optionsUpdateInventory.forEach((option: any) => {
  //   option.addEventListener('click', () => {
  //     setTimeout(() => {
  //       selectedCodeUpdateInventory.innerHTML = option.innerHTML;
  //       // SET CURRENT REFERENCE VALUE
  //       setUpdateCode(option.innerHTML);
  //     }, 300);

  //     selectedCodeUpdateInventory.parentElement.classList.remove(
  //       'active-bodega'
  //     );
  //   });
  // });
};

export default withRouter(WareHouse);
