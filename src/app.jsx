import React, { useEffect } from 'react';
import {
  Router,
  Switch,
  Route
} from "react-router-dom";
import { hot } from 'react-hot-loader';

import style from './app.module.scss';
import { getDataFx } from './utils/effector';
import history from "./utils/history";

import TileMap from './components/TileMap';
import CasesBySocial from './components/CasesBySocial';
import Newsfeed from './components/Newsfeed';
import DatePicker from './components/DatePicker';
import Statistic from './components/Statistic';
import DetailsRegion from './components/DetailsRegion/DetailsRegion';
import DiagramCasesSwitcher from './components/DiagramCasesSwitcher';
import DiagramCasesPer100Thousand from './components/DiagramCasesPer100Thousand';

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
            <div className={style.charts}>
              <CasesBySocial />
            </div>
            <DiagramCasesPer100Thousand />
            <DiagramCasesSwitcher />
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
