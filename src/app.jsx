import React from 'react';
import { hot } from 'react-hot-loader';

import style from './app.css';

import TileMap from './components/TileMap';
import MonthGraph from './components/MonthGraph';
import DiagramCasesPer100Thousand from './components/DiagramCasesPer100Thousand';
import CasesBySocial from './components/CasesBySocial';

const App = () => (
  <div className={style.app}>
    <TileMap />
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
  </div>
);

export default hot(module)(App);
