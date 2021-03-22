interface IState {
  isModalErrorOpen: boolean;
  isModalSuccessfulOpen: boolean;
  modalContent: string;
}

interface IActions {
  type: string;
}

export const reducer = (state: IState, action: IActions) => {
  if (action.type === 'ERROR_REGISTER') {
    return {
      ...state,
      isModalErrorOpen: true,
      modalContent: 'Error: no ha digitado todos los campos',
    };
  }

  if (action.type === 'ERROR_ROL') {
    return {
      ...state,
      isModalErrorOpen: true,
      modalContent: 'Error: No ha escogido un ROL',
    };
  }

  if (action.type === 'INVALID PASSWORD') {
    return {
      ...state,
      isModalErrorOpen: true,
      modalContent: 'Error: Digite una contraseña mayor o igual a 8 caracteres',
    };
  }

  if (action.type === 'PASSWORDS_DO_NOT_MATCH') {
    return {
      ...state,
      isModalErrorOpen: true,
      modalContent: 'Error: las contraseñas NO coinciden',
    };
  }

  if (action.type === 'SUCCESFUL_POST') {
    return {
      ...state,
      isModalSuccessfulOpen: true,
      modalContent: '¡GENIAL! ¡Se ha registrado correctamente!',
    };
  }

  if (action.type === 'CLOSE_MODAL') {
    return {...state, isModalErrorOpen: false, isModalSuccessfulOpen: false};
  }

  throw new Error('no matching action type');
};
