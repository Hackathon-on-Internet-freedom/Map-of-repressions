import React from 'react';
import { hot } from 'react-hot-loader';

import style from './app.css';

import history from "./utils/history";
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
} from "react-router-dom";

const App = () => (
  <Router history={history}>
    <TileMap />
    <Switch>
      <Route exact path="/">
        <div className={style.app}>
          {/* <PieChart */}
          {/*    data={socialMediaData} */}
          {/*    height={500} */}
          {/*    width={1000} */}
          {/*    id={'PieChart'} */}
          {/* /> */}
          <div className={style.charts}>
            <MonthGraph />
            <DiagramCasesPer100Thousand />
            <CasesBySocial />
          </div>

          <Newsfeed />
        </div>
      </Route>
      <Route path="/:id">
        <DetailsRegion/>
      </Route>
    </Switch>
  </Router>
      );

export default hot(module)(App);
