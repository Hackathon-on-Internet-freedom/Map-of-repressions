import gradstop from 'gradstop';

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

export function getMapData(data, settings, colors) {
  const casesByRegion = data.reduce((acc, row) => {
    acc[row[2]] = 1 + (acc[row[2]] || 0);
    return acc;
  }, {});

  const valuesToRegionMap = Object.entries(casesByRegion)
    .reduce((acc, [id, value]) => {
      if (!acc[value]) {
        acc[value] = [];
      }

      acc[value].push(id);
      return acc;
    }, {});

  const metadataObj = cookMetadata(
    [0, ...Object.values(casesByRegion)],
    colors,
    valuesToRegionMap,
  );

  const { metadata } = metadataObj;
  let { maxRank } = metadataObj;

  return Object.entries(settings).map(([id, obj]) => {
    const value = casesByRegion[id];
    let meta = metadata[id] || { color: colors.cold, rank: ++maxRank };

    return {
      ...obj,
      ...meta,
      value,
    };
  });
}

export const cookMetadata = (values, colors, valuesToRegionMap) => {
  const metadata = {};
  const valuesSet = new Set(values);
  let gradient;
  if (valuesSet.size < 2) {
    gradient = [colors.cold];
  } else {
    gradient = gradstop({
      stops: valuesSet.size,
      inputFormat: 'hex',
      colorArray: [colors.hot, colors.cold],
    });
  }

  const orderedValuesList = Array.from(valuesSet)
    .sort((a, b) => b - a);

  let rank = 0;
  gradient.forEach((color, i) => {
    const value = orderedValuesList[i];

    const regions = valuesToRegionMap[value];

    if (!regions) {
      return;
    }

    regions.forEach(region => {
      metadata[region] = {
        color,
        rank,
      };
      rank++;
    });
  });

  return {
    metadata,
    maxRank: rank - 1,
  };
}
