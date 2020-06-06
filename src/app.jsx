import React from 'react';
import { hot } from 'react-hot-loader';

import style from './app.css';
import mapData from './assets/data/data';

import TileMap from './components/TileMap';
import MonthGraph from './components/MontheGraph/MonthGraph';
import DiagramCasesPer100Thousand from './components/DiagramCasesPer100Thousand';
import CasesBySocial from './components/CasesBySocial';
import DetailsRegion from './components/DetailsRegion/DetailsRegion';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

const App = () => (
  <Router>
    <Switch>
      <Route exact  path="/">
        <div className={style.app}>
          <TileMap data={mapData} height={500} width={1000} id="TileChart" />
          {/* <PieChart */}
          {/*    data={socialMediaData} */}
          {/*    height={500} */}
          {/*    width={1000} */}
          {/*    id={'PieChart'} */}
          {/* /> */}
          <MonthGraph/>
          <DiagramCasesPer100Thousand />
          <CasesBySocial />
        </div>
      </Route>
      <Route path="/:id">
        <DetailsRegion/>
      </Route>
    </Switch>
  </Router>
);

export default hot(module)(App);
