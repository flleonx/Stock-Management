import React, {useContext} from 'react';
import {Redirect, Link, withRouter} from 'react-router-dom';
import Axios from 'axios';
import {myContext} from '../components/Context';
import './style/Home.css';

const Home = () => {
  return (
    <div className="general-container-home">
      <h2 className="general-container-home__h2">Dashboard</h2>
      <p className="general-container-home__p">
        ¡Bienvenido de nuevo! Ya puedes disfrutar del menú principal.
      </p>
    </div>
  );
};

export default withRouter(Home);
