import React, { useState, useEffect } from 'react';
import style from './DiagramCasesPer100Thousand.module.scss';
import { getValuesFx } from '../../utils/effector';
import VerticalBarChart from '../basis/VerticalBarChart';

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
      <VerticalBarChart
        height="85%"
        hideLabelList
        header="Кол-во дел на 100 тыс. населения"
        data={data}
        tooltipProps={{
          cursor: false,
          position: { y: 150, x: 500 },
          contentStyle: {
            background: 'transparent',
            color: 'white',
            border: 'none',
            fontSize: '33px'
          },
          wrapperStyle: { width: '300px', height: '400px' }
        }}
        barProps={{
          fill: '#af788d',
        }}
        yAxisProps={{
          hide: true
        }}
        xAxisProps={{
          hide: true
        }}
      />
    </div>
  )
}

export default DiagramCasesPer100Thousand;
