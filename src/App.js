import React from 'react';
import { Switch, Router, Route} from 'react-router-dom'
import Note from './components/pages/Notes'
import { createBrowserHistory } from 'history';

const App = () => (
  <div>
    <Router history={createBrowserHistory()} >
      <Switch>
        <Route path="/notes/:id/" exact component={Note} />
      </Switch>
    </Router>
  </div>
);

export default App;
