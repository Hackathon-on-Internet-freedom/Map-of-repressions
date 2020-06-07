import React from 'react';
import VerticalBarChart from '../basis/VerticalBarChart';
import { useStore } from 'effector-react';
import { casesByYears } from '../../utils/effector';

const DiagramCasesPerYear = () => {
  const rawYearData = useStore(casesByYears);

  let data = Object.keys(rawYearData).map((key) => {
    return { name: key, value: rawYearData[key] }
  });
  data = data.sort((a, b) => {
    return new Date(a.name) - new Date(b.name);
  });

  return (
    <VerticalBarChart
      data={data}
      height={400}
      width={400}
    />
  )
}

export default DiagramCasesPerYear;