import React, { useEffect, useState } from 'react';

import { getValuesFx } from '../../utils/effector';

import HorizontalBarChart from '../HorizontalBarChart';

const CasesBySocial = () => {
  const [data, setData] = useState(false);
  useEffect(() => {
    getValuesFx({
      range: 'Stat!N2:O20',
    }).then(data => {
      setData(data.map(([name, value]) => ({ name, value })))
    });
  }, []);

  if (!data) {
    return 'Загрузка...';
  }

  return (
    <HorizontalBarChart
      id="CasesBySocial"
      height={500}
      width={500}
      data={data}
      xAxisLabel="Число инцидентов"
      yAxisLabel="Соцсеть"
    />
  );
};

export default CasesBySocial;
