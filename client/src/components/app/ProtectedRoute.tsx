import React from 'react';
import {Route, Redirect} from 'react-router-dom';

function ProtectedRoute({isAuth: isAuth, component: Component, ...rest}: any) {
  return (
    <div>
      <Route
        {...rest}
        render={(props: any) => {
          if (isAuth) {
            return <Component />;
          } else {
            return (
              <Redirect
                to={{pathname: '/login', state: {from: props.location}}}
              />
            );
          }
        }}
      />
    </div>
  );
}

export default ProtectedRoute;
