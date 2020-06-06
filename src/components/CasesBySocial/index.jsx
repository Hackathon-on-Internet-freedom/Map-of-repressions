import React, { useEffect, useState } from 'react';

import style from './CasesBySocial.scss';
import { getValuesFx } from '../../utils/effector';

import HorizontalBarChart from '../HorizontalBarChart';

const CasesBySocial = () => {
  const [data, setData] = useState(false);
  useEffect(() => {
    getValuesFx({
      range: 'Stat!N2:O20',
    }).then(data => {
      setData(data.map(([name, value]) => ({ name, value: Number(value) })))
    });
  }, []);

  if (!data) {
    return 'Загрузка...';
  }

  return (
    <div className={style.root}>
      <HorizontalBarChart
        header="Кол-во инцидентов в соцсетях"
        height={400}
        width={500}
        data={data}
        yAxisProps={{
          width: 160
        }}
      />
    </div>
  );
};

export default CasesBySocial;
