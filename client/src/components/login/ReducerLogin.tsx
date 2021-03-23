interface IState {
  isModalOpen: boolean;
  modalContent: string;
}

interface IActions {
  type: string;
}

export const reducer = (state: IState, action: IActions) => {
  if (action.type === 'LOGIN_INFORMATION_INCOMPLETE') {
    return {
      ...state,
      isModalOpen: true,
      modalContent: 'Error: No ha digitado todos los campos',
    };
  }

  if (action.type === 'ERROR_AUTH') {
    return {
      ...state,
      isModalOpen: true,
      modalContent: 'Error: El Usuario y/o la contraseña son incorrectos',
    };
  }

  if (action.type === 'CLOSE_MODAL') {
    return {...state, isModalOpen: false};
  }
  throw new Error('No matching action Type');
};
