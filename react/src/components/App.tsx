import React from 'react';
import '../assets/css/App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Container from '@material-ui/core/Container';
import Login from '../pages/login';

function App() {
  return (
    <Router>
      <div>
        <Container>
          <Login />
        </Container>
        
        <Switch>
          <Route path="/about">
            <h1>About!</h1>
          </Route>
          <Route path="/users">
            <h1>Users!</h1>
          </Route>
          <Route path="/">
            <h1>Home!</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
