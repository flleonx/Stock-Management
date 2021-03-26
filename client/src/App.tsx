import React, {useState, useEffect, useContext} from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import Axios from 'axios';
import {myContext} from './components/Context';

//PAGES:
import Login from './pages/Login';
import Navbar from './components/Navbar';

//PERSONAL MODULES:
import LoginRedirect from './components/login/LoginRedirect';
import Routes from './components/RoutesComponent';

Axios.defaults.withCredentials = true;

const App = () => {
  const [isAuth, setIsAuth] = useState<Boolean>(false);
  const [enable, setEnable] = useState<Boolean>(false);
  const [enableRoutes, setEnableRoutes] = useState<Boolean>(false);
  const isAuthAPIURL: string = 'http://3.91.114.60:10000/api/isAuth';
  // const isAuthAPIURL: string = 'http://localhost:10000/api/isAuth';
  const ctx = useContext(myContext);
  let rol = {
    idRol: 0,
  };

  if (ctx) {
    rol = {
      idRol: ctx.idRol,
    };
  }

  useEffect(() => {
    Axios.get(isAuthAPIURL)
      .then((response) => {
        const userInfo: any = response.data;
        if (userInfo) {
          setIsAuth(true);
          setEnable(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isAuth]);

  useEffect(() => {}, [enableRoutes]);

  const switchActive = () => {
    setEnableRoutes(true);
  };

  if (enable) {
    return (
      <Router>
        <div style={{display: 'flex'}}>
          <Navbar switchActive={switchActive} />
          <Routes rol={rol} isAuth={isAuth} enableRoutes={enableRoutes} />
        </div>
      </Router>
    );
  }
  return (
    <Router>
      <switch>
        <LoginRedirect path="/login" component={Login} isAuth={isAuth} />
      </switch>
    </Router>
  );
};

export default App;
