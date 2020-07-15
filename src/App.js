import React from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Note from './components/pages/Notes';
import Navbar from './components/modules/Navbar';

const App = () => (
  <div>
    <Router history={createBrowserHistory()}>
      <Navbar />
      <Switch>
        <Route path="/notes/:id/" exact component={Note} />
      </Switch>
    </Router>
  </div>
);

export default App;
