import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Home from '../pages/Home';
import DressMaking from '../pages/DressMaking';
import WareHouse from '../pages/WareHouse';
import Diseño from '../pages/Design';
import Register from '../pages/Register';
import Error from '../pages/Error';
import Logout from '../pages/Logout';
import WareHouseProducts from '../pages/WareHouseProducts';
import Shops from '../pages/Shops';

import ProtectedRoute from './app/ProtectedRoute';

const Routes = ({rol, isAuth, enableRoutes}: any) => {
  if (enableRoutes) {
    return (
      <div>
        <Switch>
          {rol.idRol === 1 && (
            <ProtectedRoute
              exact
              path="/register"
              component={Register}
              isAuth={isAuth}
            />
          )}
          <ProtectedRoute exact path="/" component={Home} isAuth={isAuth} />
          <Route exact path="/dressmaking" component={DressMaking} />
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
          <ProtectedRoute
            exact
            path="/shops"
            component={Shops}
            isAuth={isAuth}
          />
          <Route path="*" component={Error} />
        </Switch>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Routes;
