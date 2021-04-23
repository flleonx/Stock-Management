import React, {useState, useReducer} from 'react';
import {Redirect} from 'react-router-dom';
import Axios from 'axios';

//CSS:
import './style/Login.css';

//My_modules:
import {baseURL} from '../components/app/baseURL';
import loginIMG from '../assets/Securelogin.svg';
import Modal from '../components/Modal';
import errorImage from '../assets/error.svg';

//Assets:

//Reducer
import {reducer} from '../components/login/ReducerLogin';

interface IDefaultState {
  isModalOpen: boolean;
  modalContent: string;
}

const defaultState: IDefaultState = {
  isModalOpen: false,
  modalContent: '',
};

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [state, dispatch] = useReducer(reducer, defaultState);
  const loginAPIURL: string = baseURL + 'api/login';

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (username && password) {
      Axios.post(loginAPIURL, {
        username,
        password,
      })
        .then((response) => {
          const isAuth: string = response.data;
          if (isAuth === 'ERROR') {
            dispatch({type: 'ERROR_AUTH'});
            const usernameInput = document.getElementById(
              'username'
            ) as HTMLInputElement;
            const passwordInput = document.getElementById(
              'password'
            ) as HTMLInputElement;
            usernameInput.value = '';
            passwordInput.value = '';
          } else {
            window.location.href = '/';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      dispatch({type: 'LOGIN_INFORMATION_INCOMPLETE'});
    }
  };

  const closeModal = () => {
    dispatch({type: 'CLOSE_MODAL'});
  };

  return (
    <div className="general-login-container">
      <form className="login-form">
        <h2>Login</h2>
        <div className="border-div"></div>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          id="username"
          autoComplete="off"
          onChange={(e: any) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          autoComplete="off"
          id="password"
          onChange={(e: any) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit} className="btn">
          Iniciar sesión
        </button>
      </form>
      {state.isModalOpen && (
        <Modal isOpen={state.isModalOpen} closeModal={closeModal}>
          <h1 className="modalLoginh1">{state.modalContent}</h1>
          <img className="modalLoginImg" src={errorImage} alt="modalImg" />
        </Modal>
      )}
      <div className="img-login-container">
        <img src={loginIMG} alt="login" />
      </div>
    </div>
  );
};

export default Login;
