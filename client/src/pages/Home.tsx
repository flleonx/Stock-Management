import React, {useContext} from 'react';
import {Redirect, Link, withRouter} from 'react-router-dom';
import Axios from 'axios';
import {myContext} from '../components/Context';

const Home = () => {
  const logoutAPIURL: string = 'http://localhost:10000/api/logout';
  const ctx = useContext(myContext);
  console.log(ctx);

  const handleClick = (e: any) => {
    Axios.post(logoutAPIURL)
      .then(() => {
        window.location.href = '/login';
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <h1>Home</h1>
      <Link to="/bodega">Bodega</Link>
      <br />
      <Link to="/tallerdesign">Taller diseño</Link>
      <br />
      <Link to="/register">Registrar</Link>
      <br />
      <button onClick={handleClick}>Cerrar sesion</button>
    </>
  );
};

export default withRouter(Home);
