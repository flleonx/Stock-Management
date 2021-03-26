import React, {useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import Axios from 'axios';
import {baseURL} from '../components/app/baseURL';

const Logout = () => {
  const logoutAPIURL: string = baseURL + 'api/logout';

  useEffect(() => {
    Axios.post(logoutAPIURL)
      .then(() => {
        window.location.href = '/login';
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return <>{/* <h1>Loading...</h1> */}</>;
};

export default withRouter(Logout);
