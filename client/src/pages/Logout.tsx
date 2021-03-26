import React, {useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import Axios from 'axios';

const Logout = () => {
  const logoutAPIURL: string = 'http://3.91.114.60:10000/api/logout';
  // const logoutAPIURL: string = 'http://localhost:10000/api/logout';

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
