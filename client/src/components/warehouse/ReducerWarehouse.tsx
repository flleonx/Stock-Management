export const reducer = (state: any, action: any) => {

  if (action.type === 'SUCCESSFUL_FORM') {
    return {
      ...state,
      modalFormContent:
        '¡Felicitaciones! Se ha agregado un nuevo insumo correctamente',
      isFormModalOpen: true,
      isModalOpen: false,
      imgCheckNumber: 1,
    };
  }

  if (action.type === 'SUCCESSFUL_UPDATE') {
    return {
      ...state,
      modalUpdateContent: 'Inventario añadido exitosamente',
      isModalUpdateOpen: true,
      isModalOpen: false,
      imgCheckNumber: 1,
    };
  }

  if (action.type === 'EXISTING_CODE') {
    return {
      ...state,
      modalFormContent:
        'Este codigo ya existe en el inventario. Por favor dirigirse a la sección Añadir a Insumo registrado',
      isFormModalOpen: true,
      isModalOpen: false,
      imgCheckNumber: 2,
    };
  }

  if (action.type === 'SUCCESSFUL_ADDING') {
    return {
      ...state,
      modalFormContent: 'Insumo añadido correctamente',
      isModalOpen: false,
      isFormModalOpen: true,
    };
  }

  if (action.type === 'WRONG_INPUT') {
    return {
      ...state,
      modalUpdateContent:
        'OJO: Por favor ingrese correctamente todos los campos',
      isModalUpdateOpen: true,
      isModalOpen: false,
      imgCheckNumber: 2,
    };
  }

  if (action.type === 'CODE_DOES_NOT_EXIST') {
    return {
      ...state,
      modalUpdateContent: 'Error: Este código no existe',
      isModalUpdateOpen: true,
      isModalOpen: false,
      imgCheckNumber: 2,
    };
  }

  if (action.type === 'INSUFFICIENT_SUPPLIES') {
    return {
      ...state,
      isOpenNoSupplies: true,
      modalContent: action.payload,
    };
  }

  if (action.type === 'CLOSE_MODAL') {
    return {
      ...state,
      isModalOpen: false,
      isOpenNoSupplies: false,
      imgCheckNumber: 0,
    };
  }
  return {
    ...state,
    isModalOpen: false,
    isFormModalOpen: false,
    isModalUpdateOpen: false,
    isOpenNoSupplies: false,
  };
};
