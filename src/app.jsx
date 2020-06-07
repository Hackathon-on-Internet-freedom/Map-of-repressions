import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader';
import {
  Router,
  Switch,
  Route
} from "react-router-dom";

import style from './app.css';
import { getDataFx } from './utils/effector';
import history from "./utils/history";

import TileMap from './components/TileMap';
import MonthGraph from './components/MonthGraph';
import DiagramCasesPer100Thousand from './components/DiagramCasesPer100Thousand';
import CasesBySocial from './components/CasesBySocial';
import Newsfeed from './components/Newsfeed';
import DatePicker from './components/DatePicker';
import Statistic from './components/Statistic';
import DetailsRegion from './components/DetailsRegion/DetailsRegion';
import GraphCasesPerMonth from './components/GraphCasesPerMonth';
import DiagramCasesPerYear from './components/DiagramCasesPerYear';

const App = () => {
  useEffect(() => {
    getDataFx();
  }, []);

  return (
    <Router history={history}>
      <div className={style.app}>
        <div className={style.headerText}>
          Карта репрессий
        </div>
        <Statistic />
        <TileMap />

        <Switch>
          <Route exact path="/">
            <GraphCasesPerMonth />
            <DiagramCasesPerYear />
            <div className={style.charts}>
              <MonthGraph />
              <DiagramCasesPer100Thousand />
              <CasesBySocial />
            </div>
            <DatePicker />
            <Newsfeed />
          </Route>

          <Route path="/:id">
            <DetailsRegion/>
            <DatePicker />
            <Newsfeed />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default hot(module)(App);
