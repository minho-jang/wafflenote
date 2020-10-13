import React from 'react';
import { Switch, HashRouter, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Note from './components/pages/Note';
import Popup from './components/pages/Popup';
import Result from './components/pages/Result';
import Login from './components/pages/Login';

const App = () => (
  <div>
    <HashRouter history={createBrowserHistory()}>
      <Switch>
        <Route path="/notes/:noteId/result/" exact component={Result} />
        <Route path="/notes/:noteId/slides/:id/" exact component={Note} />
        <Route path="/login" exact component={Login} />
        <Route path="/" exact component={Popup} />
      </Switch>
    </HashRouter>
  </div>
);

export default App;
