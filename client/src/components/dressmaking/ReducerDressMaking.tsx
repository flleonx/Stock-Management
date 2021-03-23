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
      modalContent: ["PETICIÓN EXITOSA"],
      isModalOpen: true,
      checkNumber: 1,
    };
  }
  if (action.type === "WRONG_INPUT") {
    return {
      ...state,
      modalContent: ["PORFAVOR INGRESE CORRECTAMENTE LA CANTIDAD"],
      isModalOpen: true,
      checkNumber: 2,
    };
  }
  if (action.type === "CLOSE_MODAL") {
    return { ...state, isModalOpen: false };
  }

  return { ...state, isModalOpen: false };
};
