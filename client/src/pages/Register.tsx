import React, {useState, useReducer} from 'react';
import Axios from 'axios';

//CSS:
import './style/Register.css';

//MyModuls:
import {baseURL} from '../components/app/baseURL';
import Modal from '../components/Modal';
import completeImage from '../assets/complete.svg';
import errorImage from '../assets/error.svg';

//Assets:
import registerImg from '../assets/register.svg';

//Reducer:

import {reducer} from '../components/register/ReducerRegister';

interface IDefaultState {
  isModalOpen: boolean;
  modalContent: string;
  imgCheckNumber: number;
}

interface IUser {
  username: string;
  password: string;
  idRol: string;
}

const defaultState: IDefaultState = {
  isModalOpen: false,
  modalContent: '',
  imgCheckNumber: 0,
};

const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [passwordForm, setPasswordForm] = useState<string>('');
  const [validatePasswordForm, setValidatePasswordForm] = useState<string>('');
  const [idRol, setIdRol] = useState<string>('');
  const [state, dispatch] = useReducer(reducer, defaultState);
  const postRegisterURL: string = baseURL + 'api/register';

  //DOM:
  const usernameInput = document.getElementById('username') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const validatePasswordInput = document.getElementById(
    'validPassword'
  ) as HTMLInputElement;
  const idRolInput = document.getElementById('idRol') as HTMLSelectElement;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    //VALIDATION THE DATA OF THE FORM:
    if (username && passwordForm && validatePasswordForm && idRol) {
      if (idRol !== '0') {
        if (passwordForm.length >= 7) {
          if (passwordForm === validatePasswordForm) {
            const newUser: IUser = {username, password: passwordForm, idRol};
            Axios.post(postRegisterURL, {
              user: newUser,
            })
              .then((response) => {
                const validationUsername: string = response.data;
                //VALIDATION IF THE USER EXIST OR NOT:
                if (validationUsername === '1') {
                  //THE USERNAME EXIST
                  dispatch({type: 'USERNAME_EXIST'});
                } else if (validationUsername === '2') {
                  //THE USERNAME DOESN'T EXIST
                  setUsername('');
                  setPasswordForm('');
                  setValidatePasswordForm('');
                  setIdRol('');
                  usernameInput.value = '';
                  passwordInput.value = '';
                  validatePasswordInput.value = '';
                  idRolInput.value = '0';
                  dispatch({type: 'SUCCESFUL_POST'});
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            dispatch({type: 'PASSWORDS_DO_NOT_MATCH'});
          }
        } else {
          dispatch({type: 'INVALID PASSWORD'});
        }
      } else {
        dispatch({type: 'ERROR_ROL'});
      }
    } else {
      dispatch({type: 'ERROR_REGISTER'});
    }
  };

  const closeModal = () => {
    dispatch({type: 'CLOSE_MODAL'});
  };

  return (
    <div className="general-register-container">
      <form className="register-form">
        <h2>Registrar usuario</h2>
        <div className="border-div"></div>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          autoComplete="off"
          id="username"
          onChange={(e: any) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          autoComplete="off"
          id="password"
          onChange={(e: any) => setPasswordForm(e.target.value)}
        />
        <p className="passwordInfo">
          Ingrese una contraseña de al menos 8 caracteres
        </p>
        <input
          type="password"
          name="validPassword"
          id="validPassword"
          placeholder="Contraseña nuevamente"
          autoComplete="off"
          onChange={(e: any) => setValidatePasswordForm(e.target.value)}
        />
        <select id="idRol" onChange={(e: any) => setIdRol(e.target.value)}>
          <option value="0">Seleccionar rol</option>
          <option value="1">Administrador</option>
          <option value="2">Trabajador</option>
        </select>
        <button onClick={handleSubmit} className="btn">
          Registrarse
        </button>
        {state.isModalOpen && (
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
              <img
                className="modalWarehouseImg"
                src={errorImage}
                alt="modalImg"
              />
            )}
          </Modal>
        )}
      </form>
      <div className="img-register-container">
        <img src={registerImg} alt="register" />
      </div>
    </div>
  );
};

export default Register;
