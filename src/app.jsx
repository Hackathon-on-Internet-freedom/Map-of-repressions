import React from 'react';
import { hot } from 'react-hot-loader';

import style from './app.css';

import history from "./utils/history";
import TileMap from './components/TileMap';
import MonthGraph from './components/MonthGraph';
import DiagramCasesPer100Thousand from './components/DiagramCasesPer100Thousand';
import CasesBySocial from './components/CasesBySocial';
import Newsfeed from './components/Newsfeed';
import Statistic from './components/Statistic';
import DetailsRegion from './components/DetailsRegion/DetailsRegion';
import {
  Router,
  Switch,
  Route
} from "react-router-dom";

const App = () => (
  <Router history={history}>
    <div className={style.app}>
      <div className={style.headerText}>Карта репрессий</div>
      <Statistic />
      <TileMap />

      <Switch>
        <Route exact path="/">
          <div className={style.charts}>
            <MonthGraph />
            <DiagramCasesPer100Thousand />
            <CasesBySocial />
          </div>
          <Newsfeed />
        </Route>
        <Route path="/:id">
          <DetailsRegion/>
        </Route>
      </Switch>
    </div>
  </Router>
);

export default hot(module)(App);
