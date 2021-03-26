import React, {useState, useEffect, useContext} from 'react';
import './style/Navbar.css';
import {withRouter, Link} from 'react-router-dom';
import Axios from 'axios';
import App from '../App';

function Navbar({switchActive}: any) {
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
    switchActive();
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
      <NavbarOption classIcon="gg-chart" title="Dashboard" url="/" />
      <NavbarOption classIcon="gg-pen" title="Taller Diseño" url="/diseño" />
      <NavbarOption classIcon="gg-box" title="Bodega" url="/bodega" />
      <NavbarOption
        classIcon="gg-shape-half-circle"
        title="Confección"
        url="/dressmaking"
      />
      <NavbarOption classIcon="gg-add-r" title="Registrar" url="/register" />
      <NavbarOption
        classIcon="gg-log-out"
        title="Cerrar Sesion"
        url="/logout"
      />
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
  url: string;
}

const NavbarOption = (props: INavbarOption) => {
  const {classIcon, title, url} = props;
  return (
    <Link to={url} className="click_navbar-option">
      <div className="navbar-option">
        <div className="navbar-option__icon">
          <i className={classIcon}></i>
        </div>
        <h5 className="navbar-option__h5">{title}</h5>
      </div>
    </Link>
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
