import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
//PAGES:
import Home from './pages/Home'
import DressMaking from './pages/DressMaking'
import Error from './pages/Error'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path = '/' component = {Home} />
        <Route exact path = '/DressMaking' component = {DressMaking} />
        <Route path = '*' component = {Error} />
      </Switch>
    </Router>
  );
};

export default App;
