import React from 'react';
import Graph from '../basis/Graph';
import { useStore } from 'effector-react';
import { casesByMonths } from '../../utils/effector';
import style from './GraphCasesPerMonth.module.scss';

const GraphCasesPerMonth = () => {
  const rawMonthData = useStore(casesByMonths);
  let data = Object.keys(rawMonthData).map((key) => {
    return { name: key, value: rawMonthData[key] }
  });
  data = data.sort((a, b) => {
    return new Date(a.name) - new Date(b.name);
  });

  return (
    <div className={style.container}>
      <Graph width={1400} height={600} data={data} />
    </div>
  )
}

export default GraphCasesPerMonth;
