import React from 'react';
import BarChartVertical from '../basis/BarChartVertical';
import { useStore } from 'effector-react';
import { casesByYears } from '../../utils/effector';
import styles from './DiagramCasesPerYear.module.css';

const DiagramCasesPerYear = () => {
  const rawYearData = useStore(casesByYears);

  let data = Object.keys(rawYearData).map((key) => {
    return { name: key, value: rawYearData[key] }
  });
  data = data.sort((a, b) => {
    return new Date(a.name) - new Date(b.name);
  });

  return (
    <div className={styles.container}>
      <BarChartVertical
        id="DiagramCasesPerYear"
        data={data}
        height="85%"
        hideStaticTooltip
        barClassName={styles.bar}
        barHoveredClassName={styles.barHovered}
      />
    </div>
  )
}

export default DiagramCasesPerYear;