interface IState {
  isModalOpen: boolean;
  modalContent: string;
  imgCheckNumber: number;
}

interface IActions {
  type: string;
}

export const reducer = (state: IState, action: IActions) => {
  if (action.type === 'ERROR_REGISTER') {
    return {
      ...state,
      isModalOpen: true,
      imgCheckNumber: 2,
      modalContent: 'Error: no ha digitado todos los campos',
    };
  }

  if (action.type === 'ERROR_ROL') {
    return {
      ...state,
      isModalOpen: true,
      imgCheckNumber: 2,
      modalContent: 'Error: No ha escogido un ROL',
    };
  }

  if (action.type === 'INVALID PASSWORD') {
    return {
      ...state,
      isModalOpen: true,
      imgCheckNumber: 2,
      modalContent: 'Error: Digite una contraseña mayor o igual a 8 caracteres',
    };
  }

  if (action.type === 'PASSWORDS_DO_NOT_MATCH') {
    return {
      ...state,
      isModalOpen: true,
      imgCheckNumber: 2,
      modalContent: 'Error: las contraseñas NO coinciden',
    };
  }

  if (action.type === 'USERNAME_EXIST') {
    return {
      ...state,
      isModalOpen: true,
      imgCheckNumber: 2,
      modalContent: 'Error: el usuario ya existe',
    };
  }

  if (action.type === 'SUCCESFUL_POST') {
    return {
      ...state,
      isModalOpen: true,
      imgCheckNumber: 1,
      modalContent: '¡Genial! ¡Se ha registrado correctamente!',
    };
  }

  if (action.type === 'CLOSE_MODAL') {
    return {...state, isModalOpen: false};
  }

  return {...state, isModalOpen: false, modalContent: ''};
};
