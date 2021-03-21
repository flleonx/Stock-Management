import React, { useState, useEffect } from 'react';
import Axios from 'axios'
// INTERFACES
interface IReference{
  referencia: number,
  id_talla: number,
  descripcion: string,
  color: string,
  nombre_imagen: string,
}

const DressMaking: React.FC = () => {

  const [references, setReferences] = useState<IReference[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [selectReference, setSelectReference] = useState<string>('');

  const dbReferencesURL:string = 'http://localhost:10000/api/references';
  const dbSuppliesURL:string = 'http://localhost:10000/api/suppliesrequest';

  useEffect(() => {
    Axios.get(dbReferencesURL)
    .then((response: any) => {
    setReferences(response.data)
    });
  }, []);

  const suppliesRequest = () => {
    Axios.post(dbSuppliesURL, {
      actualAmount: amount,
      referenceSelection: selectReference
    }).then(() => {
      alert('Succesful Insert');
    });
  };


  return (<>

    <h1>Taller de confección</h1>
    <select name = 'referenceSelection' onChange = {(e: any) => {
      setSelectReference(e.target.value)
    }}>
      <option value = '0'  >Seleccione la referencia</option>
      {references.map((reference: IReference) => {
        return (
          <option key = { reference.referencia } value = { reference.referencia } >
            { reference.referencia }
          </option>
        );
      })}
    </select>
    <label>Cantidad: </label>
    <input name = 'actualAmount' type = 'text' autoComplete = 'off' onChange = {(e) => {
      setAmount(e.target.value);
    }}/>
    <button type = 'button' onClick = { suppliesRequest }>Enviar</button>

  </>);
};

 export default DressMaking;
