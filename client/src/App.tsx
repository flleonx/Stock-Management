import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
//PAGES:
import Home from './pages/Home';
import DressMaking from './pages/DressMaking';
import Login from './pages/Login';
import Register from './pages/Register';
import Error from './pages/Error';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/dressmaking" component={DressMaking} />
        <Route path="*" component={Error} />
      </Switch>
    </Router>
  );
}

export default App;
