import React, { useEffect, useState } from 'react';

import style from './CasesBySocial.scss';

import HorizontalBarChart from '../HorizontalBarChart';

function sortData(rawData) {
  let data = {}
  let returnedData = []
  for (let i = 1; i < rawData.length-1; i++) {
    console.log(data, rawData[i][6])
    if (data[rawData[i][6]]) {
      data[rawData[i][6]] += 1;
    } else {
      data[rawData[i][6]] = 1;
    }
  }
  Object.keys(data).forEach(function(key) {
    returnedData.push({name: key, value: data[key]})
  });
  return returnedData
}

const CasesBySocial = (props) => {
  //const [data, setData] = useState(false);
  let data = sortData(props.rawData)

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
