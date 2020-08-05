import React from 'react';
import { Switch, HashRouter, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Note from './components/pages/Note';
import Popup from './components/pages/Popup';

const App = () => (
  <div>
    <HashRouter history={createBrowserHistory()}>
      <Switch>
        <Route path="/notes/:id/" exact component={Note} />
        <Route path="" exact component={Popup} />
      </Switch>
    </HashRouter>
  </div>
);

export default App;
