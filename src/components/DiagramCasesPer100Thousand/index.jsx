import React, { useState, useEffect } from 'react';
import HorizontalBarChart from '../HorizontalBarChart';
import api from '../../api';

const getRegionsData = () => {
  return api.gsheet.getData({
    ranges: 'Regions!A3:D87',
    fields: 'sheets'
  }).then((response) => {
    const result = response.data.sheets[0].data[0].rowData.map((row) => {
      return {
        name: row.values[0].effectiveValue.stringValue,
        value: row.values[3].effectiveValue.numberValue
      }
    });
    return result;
  }).catch(console.error);
}

function DiagramCasesPer100Thousand() {
  const [data, setData] = useState();
  useEffect(() => {
    getRegionsData().then(setData);
  }, []);

  if (data) {
    return (
      <HorizontalBarChart
        id="DiagramCasesPer100Thousand"
        height={500}
        width={500}
        data={data}
        xAxisLabel="Кол-во дел на 100 тыс. населения"
        yAxisLabel="Регионы"
      />
    )
  }else{
    return 'Загрузка...';
  }
}

export default DiagramCasesPer100Thousand;