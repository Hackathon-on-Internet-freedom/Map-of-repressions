import React from 'react';
import { useStore } from 'effector-react';

import style from './CasesBySocial.scss';
import { casesBySocials } from '../../utils/effector';

import HorizontalBarChart from '../HorizontalBarChart';

const CasesBySocial = () => {
  const { data = false } = useStore(casesBySocials);

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
          orientation: "right",
          width: 200,
          // tick: { fontSize: 24 }
        }}
      />
    </div>
  );
};

export default CasesBySocial;
