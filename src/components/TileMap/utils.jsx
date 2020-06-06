import * as gradstop from "gradstop";

export const MAP_SHEET_ID = '1Ak5b1x9Qf7yDw9f3uXliCG3PghE1JpJwPUGhsGF2VoE';
export const API_KEY = 'AIzaSyCv-UFnDjRvdIR34CQjOlwM4R3gxAoh3Iw';
export const NUMBER_OF_REGIONS = 85;
export const ORDER = {
  asc: 'ASC',
  desc: 'DESC'
}

export const VIEW = {
  map: 'MAP',
  tileChart: 'Tiles'
}

export const toggleOrder = order => {
  if (order === ORDER.asc) {return ORDER.desc}
  return ORDER.asc;
}

export const handleColors = data => {
  return {'hot': data[0][0], 'cold': data[0][1]};
}

export const handleRegions = (data, colors) => {
  let mapData = [];
  let values = [];

  // keys are in 0th row
  let keys = data[0];
  // helper map for metadata collection
  let valuesToRegionMap = new Map();

  // aggregate data to array of dicts of single region data
  for (let i = 1; i < data.length; i++) {
    let region = {};
    for (let j = 0; j < keys.length; j++) {
      let dataPoint = data[i][j];
      if (keys[j] === 'value') {
        dataPoint = parseInt(data[i][j]);
      }
      region[keys[j]] = dataPoint;
    }
    let listOfRegions = valuesToRegionMap.get(region.value);
    if (listOfRegions === undefined) {
      listOfRegions = [];
    }
    listOfRegions.push(region.region);
    valuesToRegionMap.set(region.value, listOfRegions);
    // precalculate list of values to use it for metadata processing
    values.push(region.value);
    mapData.push(region);
  }
  let metadata = cookMetadata(mapData, values, colors, valuesToRegionMap);
  mapData.forEach(r => {
    let region = metadata.get(r.region)
    r.color = region.color;
    r.rank = region.rank;
  });
  return mapData;
}

export const cookMetadata = (mapData, values, colors, valuesToRegionMap) => {
  let metadata = new Map();
  const valuesSet = new Set(values);
  const gradient = gradstop({
    stops: valuesSet.size,
    inputFormat: 'hex',
    colorArray: [colors.hot, colors.cold]
  });

  const orderedValuesList = Array.from(valuesSet)
    .sort((a,b) => b-a);
  const valueToColorMap = {}
  for (let i = 0; i < gradient.length; i++) {
    valueToColorMap[orderedValuesList[i]] = gradient[i];
  }

  let cnt = 0;
  for (let i = 0; i < gradient.length; i++) {
    let value = orderedValuesList[i];
    let listOfRegions = valuesToRegionMap.get(value);
    for (let j = 0; j < listOfRegions.length; j++) {
      let region = listOfRegions[j];
      metadata.set(region, {color: valueToColorMap[value], rank: cnt})
      cnt++;
    }
  }
  return metadata;
}