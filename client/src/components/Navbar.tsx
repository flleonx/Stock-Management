import React, {useState, useEffect, useContext} from 'react';
import './style/Navbar.css';
import {withRouter, Link, NavLink} from 'react-router-dom';
import Axios from 'axios';
import App from '../App';
import {baseURL} from './app/baseURL';

function Navbar({switchActive}: any) {
  const [enable, setEnable] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const isAuthAPIURL: string = baseURL + 'api/isAuth';

  useEffect(() => {
    Axios.get(isAuthAPIURL)
      .then((response) => {
        const userInfo: any = response.data;
        setUser(userInfo.user);
        setEnable(true);
      })
  }, [enable]);

  if (enable) {
    switchActive();
    return (
      <div className="navbar-user-container">
        <NavbarContainer user={user} />
      </div>
    );
  }

  return <></>;
}

const NavbarContainer = (props: any) => {
  return (
    <div className="navbar-container">
      <Brand />
      <NavbarOption classIcon="gg-chart" title="Dashboard" url="/" />
      <NavbarOption classIcon="gg-pen" title="Taller Diseño" url="/diseño" />
      <NavbarOption classIcon="gg-box" title="Bodega Insumo" url="/warehouse" />
      <NavbarOption
        classIcon="gg-shape-half-circle"
        title="Confección"
        url="/dressmaking"
      />
      <NavbarOption
        classIcon="gg-browse"
        title="Bodega Producto"
        url="/warehouseproducts"
      />
      <NavbarOption classIcon="gg-home-alt" title="Tiendas" url="/shops" />
      <NavbarOption classIcon="gg-add-r" title="Registrar" url="/register" />
      <NavbarOption
        classIcon="gg-log-out"
        title="Cerrar Sesion"
        url="/logout"
      />
      <UserSection user={props.user} />
    </div>
  );
};

const Brand = () => {
  return (
    <div className="navbar-brand">
      <div className="navbar-brand__icon">
        <i className="gg-read"></i>
      </div>
      <h5 className="navbar-brand__h5">Rutnev</h5>
    </div>
  );
};

interface INavbarOption {
  classIcon: string;
  title: string;
  url: string;
}

const NavbarOption = (props: INavbarOption) => {
  const {classIcon, title, url} = props;
  return (
    <NavLink
      exact
      to={url}
      className="click_navbar-option"
      activeClassName="clicked_navbar-option"
    >
      <div className="navbar-option">
        <div className="navbar-option__icon">
          <i className={classIcon}></i>
        </div>
        <h5 className="navbar-option__h5">{title}</h5>
      </div>
    </NavLink>
  );
};

const UserSection = (props: any) => {
  return(
    <div className="user-section">
      <div className="user-section__icon">
          <i className="gg-user"></i>
        </div>
      <h4>{props.user}</h4>
    </div>
  );
}

export default withRouter(Navbar);
