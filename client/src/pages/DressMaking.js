import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const DressMaking = () => {

  const [references, setReferences] = useState([]);
  const [amount, setAmount] = useState('');
  const [selectReference, setSelectReference] = useState('');


  const dbReferencesURL = 'http://localhost:10000/api/references';
  const dbSuppliesURL = 'http://localhost:10000/api/suppliesrequest';

  useEffect(() => {
    Axios.get(dbReferencesURL)
    .then((response) => {
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
    <select name = 'referenceSelection' onChange = {(e) => {
      setSelectReference(e.target.value)
    }}>
      <option value = '0'  >Seleccione la referencia</option>
      {references.map((reference) => {
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
