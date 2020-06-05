import React from 'react';
import { hot } from 'react-hot-loader';

import style from './app.css';
import mapData from './assets/data/data';

import TileMap from './components/TileMap';
import MonthGraph from './components/MontheGraph/MonthGraph';
import DiagramCasesPer100Thousand from './components/DiagramCasesPer100Thousand';
import CasesBySocial from './components/CasesBySocial';

const App = () => (
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
);

export default hot(module)(App);
