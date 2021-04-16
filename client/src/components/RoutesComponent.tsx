import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from '../pages/Home';
import DressMaking from '../pages/DressMaking';
import WareHouse from '../pages/WareHouse';
import Diseño from '../pages/Design';
import Register from '../pages/Register';
import Error from '../pages/Error';
import Logout from '../pages/Logout';

import ProtectedRoute from './app/ProtectedRoute';
import WareHouseProducts from '../pages/WareHouseProducts';

const Routes = ({rol, isAuth, enableRoutes}: any) => {
  if (enableRoutes) {
    return (
      <div style={{margin: '55px 0px 0px 0px'}}>
        <Switch>
          {rol.idRol === 1 && (
            <ProtectedRoute
              exact
              path="/register"
              component={Register}
              isAuth={isAuth}
            />
          )}
          {/* {rol.idRol === 2 && (
          )} */}
          <ProtectedRoute exact path="/" component={Home} isAuth={isAuth} />
          <Route exact path="/dressmaking" component={DressMaking} />
          <ProtectedRoute
            path="/warehouse"
            component={WareHouse}
            isAuth={isAuth}
          />
          <ProtectedRoute path="/diseño" component={Diseño} isAuth={isAuth} />
          <ProtectedRoute path="/logout" component={Logout} isAuth={isAuth} />
          <ProtectedRoute path="/warehouseproducts" component={WareHouseProducts} isAuth={isAuth} />
          <Route path="*" component={Error} />
        </Switch>
      </div>
    );
  }

  return <></>;
};

export default Routes;
