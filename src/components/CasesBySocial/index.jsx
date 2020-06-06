import React, { useMemo } from 'react';
import { useStore } from 'effector-react';

import style from './CasesBySocial.scss';
import { dataBySocials } from '../../utils/effector';

import HorizontalBarChart from '../HorizontalBarChart';

const CasesBySocial = () => {
  const socialDataMap = useStore(dataBySocials);

  const data = useMemo(
    () => {
      const values = Object.keys(socialDataMap).map(name => ({
        name,
        value: socialDataMap[name].length,
      }));

      values.sort((a, b) => b.value - a.value);

      return [
        ...values.slice(0, 10),
        values.slice(10).reduce((acc, { value }) => {
          acc.value += value;
          return acc;
        }, { name: 'Другое', value: 0 }),
      ];
    },
    [socialDataMap],
  );


  if (!data) {
    return 'Загрузка...';
  }

  console.log('AAAAAAAAAAA', data)

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
