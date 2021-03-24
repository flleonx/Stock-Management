import React, {useState, useEffect, useContext} from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import Axios from 'axios';
import {myContext} from './components/Context';

//PAGES:
import Home from './pages/Home';
import DressMaking from './pages/DressMaking';
import Bodega from './pages/Bodega';
import TallerDesign from './pages/TallerDesign';
import Login from './pages/Login';
import Register from './pages/Register';
import Error from './pages/Error';

//PERSONAL MODULES:
import ProtectedRoute from './components/app/ProtectedRoute';
import LoginRedirect from './components/login/LoginRedirect';

Axios.defaults.withCredentials = true;

function App(): any {
  const [isAuth, setIsAuth] = useState<Boolean>(false);
  const [enable, setEnable] = useState<Boolean>(false);
  const isAuthAPIURL: string = 'http://localhost:10000/api/isAuth';
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
        }
        setEnable(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isAuth]);

  if (enable) {
    return (
      <Router>
        <Switch>
          {rol.idRol === 1 && (
            <ProtectedRoute
              exact
              path="/register"
              component={Register}
              isAuth={isAuth}
            />
          )}
          {rol.idRol === 2 && (
            <ProtectedRoute
              path="/tallerdesign"
              component={TallerDesign}
              isAuth={isAuth}
            />
          )}
          <ProtectedRoute exact path="/" component={Home} isAuth={isAuth} />
          <Route exact path="/dressmaking" component={DressMaking} />
          <ProtectedRoute path="/bodega" component={Bodega} isAuth={isAuth} />
          <LoginRedirect path="/login" component={Login} isAuth={isAuth} />
          <Route path="*" component={Error} />
        </Switch>
      </Router>
    );
  }
  return <></>;
}

export default App;
