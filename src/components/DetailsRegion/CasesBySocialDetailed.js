import React, { useEffect, useState } from 'react';

import style from './CasesBySocial.scss';

import HorizontalBarChart from '../HorizontalBarChart';

function sortData(rawData) {
  let data = {}
  let returnedData = []
  for (let i = 1; i < rawData.length-1; i++) {
    if (data[rawData[6]]) {
      data[rawData[6]] += 1;
    } else {
      data[rawData[6]] = 1;
    }
  }
  Object.keys(data).forEach(function(key) {
    returnedData.push({name: key, value: data[key]})
  });
  console.log('GGGGGG', returnedData)
  return returnedData
}

const CasesBySocial = (rawData) => {
  console.log(rawData)
  const [data, setData] = useState(false);
  setData(sortData(rawData))

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
