import React, {useContext} from 'react';
import {Redirect, Link, withRouter} from 'react-router-dom';
import Axios from 'axios';
import {myContext} from '../components/Context';

const Home = () => {
  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
};

export default withRouter(Home);
