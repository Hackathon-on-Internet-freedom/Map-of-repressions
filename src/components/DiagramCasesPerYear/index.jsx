import React from 'react';
import VerticalBarChart from '../basis/VerticalBarChart';
import { useStore } from 'effector-react';
import { casesByYears } from '../../utils/effector';
import style from './DiagramCasesPerYear.module.scss';

const DiagramCasesPerYear = () => {
  const rawYearData = useStore(casesByYears);

  let data = Object.keys(rawYearData).map((key) => {
    return { name: key, value: rawYearData[key] }
  });
  data = data.sort((a, b) => {
    return new Date(a.name) - new Date(b.name);
  });

  return (
    <div className={style.container}>
      <VerticalBarChart
        data={data}
        height={400}
        tooltipProps={{
          cursor: false,
          position: { y: 150, x: 500 },
          // contentStyle: { background: 'transparent' },
          // wrapperStyle: { width: '300px', height: '400px', border: 'none' }
        }}
        yAxisProps={{
          hide: true
        }}
      />
    </div>
  )
}

export default DiagramCasesPerYear;