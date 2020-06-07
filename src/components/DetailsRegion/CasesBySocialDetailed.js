import React, { useMemo } from 'react';

import style from './CasesBySocial.module.scss';

import HorizontalBarChart from '../basis/HorizontalBarChart';

function sortData(rawData) {
  let data = {}
  let returnedData = []
  for (let i = 0; i < rawData.length; i++) {
    if (data[rawData[i][6]]) {
      data[rawData[i][6]] += 1;
    } else {
      data[rawData[i][6]] = 1;
    }
  }
  Object.keys(data).forEach(function(key) {
    returnedData.push({name: key, value: data[key]})
  });
  returnedData.sort((a, b) => {return -(a.value-b.value)})
  return returnedData
}

const CasesBySocial = (props) => {
  const data = useMemo(
    () => sortData(props.rawData),
    [props.rawData],
  );

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
          width: 220
        }}
      />
    </div>
  );
};

export default CasesBySocial;
