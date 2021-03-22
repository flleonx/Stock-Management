import React, {useState, useReducer} from 'react';
import Axios from 'axios';

//CSS:
import './style/Register.css';

//MyModuls:
import ErrorModal from '../components/ErrorModal';
import SuccessfulModal from '../components/SuccessfulModal';

//Assets:
import model_img from '../assets/model-photo.jpeg';
import user_register from '../assets/user.png';

//Reducer:

import {reducer} from '../components/register/ReducerRegister';

interface IDefaultState {
  isModalErrorOpen: boolean;
  isModalSuccessfulOpen: boolean;
  modalContent: string;
}

interface IUser {
  username: string;
  password: string;
  idRol: string;
}

const defaultState: IDefaultState = {
  isModalErrorOpen: false,
  isModalSuccessfulOpen: false,
  modalContent: '',
};

const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [passwordForm, setPasswordForm] = useState<string>('');
  const [validatePasswordForm, setValidatePasswordForm] = useState<string>('');
  const [idRol, setIdRol] = useState<string>('');
  const [state, dispatch] = useReducer(reducer, defaultState);
  const postRegisterURL: string = 'http://localhost:10000/api/register';

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
    <div className="body-register-container">
      <div className="img-container">
        <img src={model_img} alt="model" className="img-container__img" />
      </div>
      <div className="background-effect-img-container"></div>
      <div className="register-container">
        <div className="register-img-container">
          <img src={user_register} alt="user" />
        </div>
        <h3>Register</h3>
        <form>
          <label>Usuario:</label>
          <input
            type="text"
            name="username"
            placeholder="Digete aquí el usuario"
            autoComplete="off"
            id="username"
            onChange={(e: any) => setUsername(e.target.value)}
          />
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            placeholder="Digite aquí la contraseña"
            autoComplete="off"
            id="password"
            onChange={(e: any) => setPasswordForm(e.target.value)}
          />
          <span className="passwordInfo">
            Ingrese una contraseña de al menos 8 caracteres
          </span>
          <label>Confirmar contraseña:</label>
          <input
            type="password"
            name="validPassword"
            id="validPassword"
            placeholder="Digite aquí nuevamente la contraseña"
            autoComplete="off"
            onChange={(e: any) => setValidatePasswordForm(e.target.value)}
          />
          <label>Rol:</label>
          <select id="idRol" onChange={(e: any) => setIdRol(e.target.value)}>
            <option value="0">Seleccionar rol</option>
            <option value="1">Administrador</option>
            <option value="2">Trabajador</option>
          </select>
          <button onClick={handleSubmit}>Registrarse</button>
        </form>
        {state.isModalErrorOpen && (
          <ErrorModal
            closeModal={closeModal}
            modalContent={state.modalContent}
          />
        )}
        {state.isModalSuccessfulOpen && (
          <SuccessfulModal
            closeModal={closeModal}
            modalContent={state.modalContent}
          />
        )}
        ;
      </div>
    </div>
  );
};

export default Register;
