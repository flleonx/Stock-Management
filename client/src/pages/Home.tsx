import React from 'react';
import Axios from 'axios';
import cookies from 'react-cookie';
// import {withRouter} from 'react-router-dom';

const Home = () => {
  const logoutAPIURL: string = 'http://localhost:10000/api/logout';

  const handleClick = (e: any) => {
    e.preventDefault();
    Axios.post(logoutAPIURL).catch((err) => {
      console.log(err);
    });
  };
  return (
    <>
      <h1>Home</h1>
      <button onClick={handleClick}>Cerrar sesion</button>
    </>
  );
};

export default Home;
