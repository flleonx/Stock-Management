import React, {useState, useEffect, useContext} from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import Axios from 'axios';
import {myContext} from './components/Context';

//PAGES:
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DressMaking from './pages/DressMaking';
import WareHouse from './pages/WareHouse';
import Diseño from './pages/Design';
import Register from './pages/Register';
import Error from './pages/Error';
import Logout from './pages/Logout';
import WareHouseProducts from './pages/WareHouseProducts';
import Shops from './pages/Shops';

//PERSONAL MODULES:
import LoginRedirect from './components/login/LoginRedirect';
import Routes from './components/RoutesComponent';
import {baseURL} from './components/app/baseURL';
import ProtectedRoute from './components/app/ProtectedRoute';

Axios.defaults.withCredentials = true;

const App = () => {
  const [isAuth, setIsAuth] = useState<Boolean>(false);
  const [enable, setEnable] = useState<Boolean>(false);
  const [enableRoutes, setEnableRoutes] = useState<Boolean>(false);
  const isAuthAPIURL: string = baseURL + 'api/isAuth';
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
        } else {
          setIsAuth(false);
          setEnable(false);
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
        <div className="maxDiv-Control-App">
          <Navbar switchActive={switchActive} />
          <div className="maxDiv-Control-App__Routes">
            <Routes rol={rol} isAuth={isAuth} enableRoutes={enableRoutes} />
          </div>
        </div>
      </Router>
    );
  }
  return (
    <Router>
      <switch>
        <LoginRedirect
          path="/login"
          component={Login}
          isAuth={isAuth}
          enable={enable}
        />
        <ProtectedRoute exact path="/" component={Home} isAuth={isAuth} />
        <ProtectedRoute exact path="/dressmaking" component={DressMaking} />
        <ProtectedRoute
          path="/warehouse"
          component={WareHouse}
          isAuth={isAuth}
        />
        <ProtectedRoute
          exact
          path="/diseño"
          component={Diseño}
          isAuth={isAuth}
        />
        <ProtectedRoute
          exact
          path="/logout"
          component={Logout}
          isAuth={isAuth}
        />
        <ProtectedRoute
          exact
          path="/warehouseproducts"
          component={WareHouseProducts}
          isAuth={isAuth}
        />
        <ProtectedRoute exact path="/shops" component={Shops} isAuth={isAuth} />
        <ProtectedRoute
          exact
          path="/register"
          component={Register}
          isAuth={isAuth}
        />
      </switch>
    </Router>
  );
};

export default App;
