import React from 'react';
import {Route, Redirect} from 'react-router-dom';

function LoginRedirect({isAuth: isAuth, component: Component, ...rest}: any) {
  return (
    <div>
      <Route
        {...rest}
        render={(props: any) => {
          if (!isAuth) {
            return <Component />;
          } else {
            return (
              <Redirect to={{pathname: '/', state: {from: props.location}}} />
            );
          }
        }}
      />
    </div>
  );
}

export default LoginRedirect;
