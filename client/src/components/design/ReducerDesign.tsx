export const reducer = (state: any, action: any) => {
  if (action.type === "INSUFFICIENT_SUPPLIES") {
    const warningMissingSupplies = action.payload;
    return {
      ...state,
      modalContent: warningMissingSupplies,
      isModalOpen: true,
      checkNumber: 0,
    };
  }
  if (action.type === "SUCCESSFUL_REQUEST") {
    return {
      ...state,
      modalContent: ["La referencia se ha guardado correctamente"],
      isModalOpen: true,
      checkNumber: 1,
    };
  }
  if (action.type === "FAILED_REQUEST") {
    return {
      ...state,
      modalContent: ["La petición no ha tenido exito"],
      isModalOpen: true,
      checkNumber: 2,
    };
  }
  if (action.type === "INVALID_REFERENCE") {
    return {
      ...state,
      modalContent: ["Ya existe la referencia que desea ingresar"],
      isModalOpen: true,
      checkNumber: 3,
    };
  }
  if (action.type === "WRONG_INPUT") {
    return {
      ...state,
      modalContent: ["Ingrese correctamente los campos"],
      isModalOpen: true,
      checkNumber: 4,
    }; 
  }

  if (action.type === "CLOSE_MODAL") {
    return { ...state, isModalOpen: false };
  }

  return { ...state, isModalOpen: false };
};
