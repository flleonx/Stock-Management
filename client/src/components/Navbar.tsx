import React, {useState, useEffect, useContext} from 'react';
import './style/Navbar.css';
import {withRouter} from 'react-router-dom';
import Axios from 'axios';

function Navbar() {
  const [enable, setEnable] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const isAuthAPIURL: string = 'http://localhost:10000/api/isAuth';

  useEffect(() => {
    Axios.get(isAuthAPIURL)
      .then((response) => {
        const userInfo: any = response.data;
        setUser(userInfo.user);
        setEnable(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [enable]);

  if (enable) {
    return (
      <div className="navbar-user-container">
        <NavbarContainer />
        <UserSection username={user} />
      </div>
    );
  }

  return <></>;
}

const NavbarContainer = () => {
  return (
    <div className="navbar-container">
      <Brand />
      <NavbarOption classIcon="gg-chart" title="Dashboard" />
      <NavbarOption classIcon="gg-pen" title="Taller Diseño" />
      <NavbarOption classIcon="gg-box" title="Bodega" />
      <NavbarOption classIcon="gg-shape-half-circle" title="Confección" />
      <NavbarOption classIcon="gg-add-r" title="Registrar" />
      <NavbarOption classIcon="gg-log-out" title="Cerrar Sesion" />
    </div>
  );
};

const Brand = () => {
  return (
    <div className="navbar-brand">
      <div className="navbar-brand__icon">
        <i className="gg-atlasian"></i>
      </div>
      <h5 className="navbar-brand__h5">Atlasian</h5>
    </div>
  );
};

interface INavbarOption {
  classIcon: string;
  title: string;
}

const NavbarOption = (props: INavbarOption) => {
  const {classIcon, title} = props;
  return (
    <div className="navbar-option">
      <div className="navbar-option__icon">
        <i className={classIcon}></i>
      </div>
      <h5 className="navbar-option__h5">{title}</h5>
    </div>
  );
};

const UserSection = (props: any) => {
  const {username} = props;
  return (
    <div className="user-section">
      <h4 className="user-section__h4">{username}</h4>
      <div className="user-section__icon">
        <i className="gg-user"></i>
      </div>
    </div>
  );
};

export default withRouter(Navbar);
