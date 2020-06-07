import React from 'react';
import { useStore } from 'effector-react';

import style from './CasesBySocial.scss';
import { casesBySocials } from '../../utils/effector';

import HorizontalBarChart from '../basis/HorizontalBarChart';

const CasesBySocial = () => {
  let { data = false } = useStore(casesBySocials);

  if (!data) {
    return 'Загрузка...';
  }

  data = data.sort((a, b) => b.value - a.value);
  const sum = data.reduce((memo, d) => {
    return memo + d.value;
  }, 0);
  
  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    const yOffset = 15;
    const xOffset = 10;
  
    return (
      <g>
        <text
          className={style.listLabel}
          x={x + width + xOffset}
          y={y + yOffset}
          fill="#000" textAnchor="right"
          dominantBaseline="middle"
        >
          <tspan className={style.procent}>{(value / sum * 100).toFixed(2)}% </tspan>
          {value}
        </text>
      </g>
    );
  };


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
        }}
        xAxisProps={{
          padding: { right: 100 }
        }}
        labelListProps={{
          content: renderCustomizedLabel
        }}
      />
    </div>
  );
};

export default CasesBySocial;
