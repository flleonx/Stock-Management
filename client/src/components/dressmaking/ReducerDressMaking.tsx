export const reducer = (state: any, action: any) => {
  if (action.type === 'INSUFFICIENT_SUPPLIES') {
    const warningMissingSupplies = action.payload;
    return {
      ...state,
      modalContent: warningMissingSupplies,
      isInsufficientModalOpen: true,
      checkNumber: 0,
      imgCheckNumber: 2,
    };
  }
  if (action.type === 'SUCCESSFUL_REQUEST') {
    return {
      ...state,
      modalContent: ['Petición realizada con exito'],
      isModalOpen: true,
      isInsufficientModalOpen: false,
      checkNumber: 1,
      imgCheckNumber: 1,
    };
  }
  if (action.type === 'WRONG_INPUT') {
    return {
      ...state,
      modalContent: ['Por favor: Ingrese correctamente los campos.'],
      isModalOpen: true,
      isInsufficientModalOpen: false,
      checkNumber: 2,
      imgCheckNumber: 2,
    };
  }
  if (action.type === 'CLOSE_MODAL') {
    return {
      ...state,
      isModalOpen: false,
      isInsufficientModalOpen: false,
      imgCheckNumber: 0,
    };
  }

  return {...state, isModalOpen: false, imgCheckNumber: 0};
};
