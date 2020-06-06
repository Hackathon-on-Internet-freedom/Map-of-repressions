import React from 'react';
import { hot } from 'react-hot-loader';

import style from './app.css';

import TileMap from './components/TileMap';
import MonthGraph from './components/MonthGraph';
import DiagramCasesPer100Thousand from './components/DiagramCasesPer100Thousand';
import CasesBySocial from './components/CasesBySocial';
import Newsfeed from './components/Newsfeed';
import DetailsRegion from './components/DetailsRegion/DetailsRegion';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <div className={style.app}>
          <TileMap />
          <MonthGraph/>
          <DiagramCasesPer100Thousand />
          <CasesBySocial />
        </div>
        <Newsfeed />
      </Route>
      <Route path="/:id">
        <DetailsRegion/>
      </Route>
    </Switch>
  </Router>
);

export default hot(module)(App);
