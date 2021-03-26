import React, {
  createContext,
  Props,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from 'react';
import Axios from 'axios';

import {baseURL} from './app/baseURL';

export const myContext = createContext<any>({});
function Context(props: PropsWithChildren<any>) {
  const [user, setUser] = useState<any>();
  const isAuthAPIURL: string = baseURL + 'api/isAuth';

  useEffect(() => {
    Axios.get(isAuthAPIURL)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <myContext.Provider value={user}>{props.children}</myContext.Provider>;
}

export default Context;
