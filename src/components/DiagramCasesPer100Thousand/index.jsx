import React, { useState, useEffect } from 'react';
import styles from './DiagramCasesPer100Thousand.module.css';
import { getValuesFx } from '../../utils/effector';
import BarChartVertical from '../basis/BarChartVertical';
import TextHeader from 'components/basis/TextHeader';

const DiagramCasesPer100Thousand = () => {
  const [data, setData] = useState();
  useEffect(() => {
    getValuesFx({
      range: 'Regions!A3:D87',
    }).then(data => {
      setData(data.map(([name, , , value]) => ({ name, value: parseFloat(value) })));
    });
  }, []);

  if (!data) {
    return 'Загрузка...';
  }

  return (
    <div className={styles.container}>
      <TextHeader>Кол-во дел на 100 тыс. населения</TextHeader>
      <BarChartVertical
        id="DiagramCasesPer100Thousand"
        height="85%"
        data={data}
        barClassName={styles.bar}
        listLabelClassName={styles.listLabel}
        staticTooltipValueLabel="дел"
      />
    </div>
  )
}

export default DiagramCasesPer100Thousand;
