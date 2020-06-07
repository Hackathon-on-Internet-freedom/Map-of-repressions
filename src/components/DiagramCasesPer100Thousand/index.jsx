import React, { useState, useEffect } from 'react';
import style from './DiagramCasesPer100Thousand.scss';
import { getValuesFx } from '../../utils/effector';
import HorizontalBarChart from '../basis/HorizontalBarChart';

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
        header="Кол-во дел на 100 тыс. населения"
        width={500}
        height={1200}
        data={data}
        yAxisProps={{
          width: 260
        }}
      />
    </div>
  )
}

export default DiagramCasesPer100Thousand;