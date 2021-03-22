import React, {useState, useReducer} from 'react';

//CSS:
import './style/Login.css';

//My_modules:
import ErrorModal from '../components/ErrorModal';

//Assets:
import model_photo from '../assets/model-photo.jpeg';
import user_img from '../assets/user.png';

//Reducer
import {reducer} from '../components/login/ReducerLogin';

interface IDefaultState {
  isModalOpen: boolean;
  modalContent: string;
}

interface IUser {
  username: string;
  password: string;
}

const defaultState: IDefaultState = {
  isModalOpen: false,
  modalContent: '',
};

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [state, dispatch] = useReducer(reducer, defaultState);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (username && password) {
      const newUserLogin: IUser = {username, password};
      console.log(newUserLogin);
    } else {
      dispatch({type: 'ERROR_LOGIN'});
    }
  };

  const closeModal = () => {
    dispatch({type: 'CLOSE_MODAL'});
  };

  return (
    <div className="body-container">
      <div className="image-container">
        <img src={model_photo} alt="model" className="image-container__img" />
      </div>
      <div className="div-effect"></div>
      <div className="login-container">
        <div className="login-image-container">
          <img src={user_img} alt="login" />
        </div>
        <h3>Login</h3>
        <form>
          <label>Usuario:</label>
          <input
            type="text"
            name="username"
            placeholder="Digite aquí el usuario"
            autoComplete="off"
            onChange={(e: any) => setUsername(e.target.value)}
          />
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            placeholder="Digite aquí la contraseña"
            autoComplete="off"
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <button onClick={handleSubmit}>Iniciar sesión </button>
        </form>
        {state.isModalOpen && (
          <ErrorModal
            closeModal={closeModal}
            modalContent={state.modalContent}
          />
        )}
        ;
      </div>
    </div>
  );
};

export default Login;
