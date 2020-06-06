import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader';

import style from './app.css';
import { getDataFx } from './utils/effector';

import TileMap from './components/TileMap';
import MonthGraph from './components/MonthGraph';
import DiagramCasesPer100Thousand from './components/DiagramCasesPer100Thousand';
import CasesBySocial from './components/CasesBySocial';
import Newsfeed from './components/Newsfeed';

const App = () => {
  useEffect(() => {
    getDataFx();
  }, []);

  return (
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

      <Newsfeed />
    </div>
  );
};

export default hot(module)(App);
