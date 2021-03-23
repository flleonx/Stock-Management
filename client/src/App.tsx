import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import Axios from 'axios';

//PAGES:
import Home from './pages/Home';
import DressMaking from './pages/DressMaking';
import Bodega from './pages/Bodega';
import Login from './pages/Login';
import Register from './pages/Register';
import Error from './pages/Error';

//PERSONAL MODULES:
import ProtectedRoute from './components/app/ProtectedRoute';

Axios.defaults.withCredentials = true;

function App(): any {
  const [isAuth, setIsAuth] = useState<Boolean>(false);
  const [enable, setEnable] = useState<Boolean>(false);
  const isAuthAPIURL: string = 'http://localhost:10000/api/isAuth';

  useEffect(() => {
    Axios.get(isAuthAPIURL)
      .then((response) => {
        const isAuthenticated: boolean = response.data;
        console.log(isAuthenticated);
        setIsAuth(isAuthenticated);
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
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/dressmaking" component={DressMaking} />
          <ProtectedRoute path="/bodega" component={Bodega} isAuth={isAuth} />
          <Route path="*" component={Error} />
        </Switch>
      </Router>
    );
  }
  return <></>;
}

export default App;
