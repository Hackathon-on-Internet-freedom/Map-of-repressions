import React, { useState, useEffect } from 'react';

import style from './DiagramCasesPer100Thousand.scss';
import { getValuesFx } from '../../utils/effector';

import HorizontalBarChart from '../HorizontalBarChart';

function DiagramCasesPer100Thousand() {
  const [data, setData] = useState();
  useEffect(() => {
    getValuesFx({
      range: 'Regions!A3:D87',
    }).then(data => {
      setData(data.map(([name, , , value]) => ({ name, value: parseFloat(value) })));
    });
  }, []);

  if (!data) {
    return 'Загрузка...';
  }

  return (
    <div className={style.root}>
      <HorizontalBarChart
        id="DiagramCasesPer100Thousand"
        height={500}
        width={350}
        data={data}
        xAxisLabel="Кол-во дел на 100 тыс. населения"
        yAxisLabel="Регионы"
      />
    </div>
  );
}

export default DiagramCasesPer100Thousand;
