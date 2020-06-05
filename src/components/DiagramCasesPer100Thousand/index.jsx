import React, { useState, useEffect } from 'react';

import { getValuesFx } from '../../utils/effector';

import HorizontalBarChart from '../HorizontalBarChart';

function DiagramCasesPer100Thousand() {
  const [data, setData] = useState();
  useEffect(() => {
    getValuesFx({
      range: 'Regions!A3:D87',
    }).then(data => {
      setData(data.map(([name, , , value]) => ({ name, value })));
    });
  }, []);

  if (data) {
    return (
      <HorizontalBarChart
        id="DiagramCasesPer100Thousand"
        height={500}
        width={500}
        data={data}
        xAxisLabel="Кол-во дел на 100 тыс. населения"
        yAxisLabel="Регионы"
      />
    );
  } else {
    return 'Загрузка...';
  }
}

export default DiagramCasesPer100Thousand;
