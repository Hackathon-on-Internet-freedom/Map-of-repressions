import React, { useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import gradstop from 'gradstop';

import styles from './TileMap.scss';
import {
  colorSchema,
  dataBySocials,
  getMapValues,
  mapSettings,
  rawData,
  selectedSocial,
  selectedTiles,
  setSelectedSocial,
  setSelectedTiles,
  socialList,
} from '../../utils/effector';

import GenericChart from '../GenericChart';
import { useStore } from 'effector-react';
import { MAP_ID_KEY } from '../../constants';
import { combine } from 'effector';

const MAP_SHEET_ID = '1Ak5b1x9Qf7yDw9f3uXliCG3PghE1JpJwPUGhsGF2VoE';
const API_KEY = 'AIzaSyCv-UFnDjRvdIR34CQjOlwM4R3gxAoh3Iw';

const handleColors = data => {
  return {'hot': data[0][0], 'cold': data[0][1]};
}

const createColors = (values, colors) => {
  let colorMap = {}
  const valuesSet = new Set(values);
  const gradient = gradstop({
    stops: valuesSet.size,
    inputFormat: 'hex',
    colorArray: [colors.hot, colors.cold]
  });
  const orderedValuesList = Array.from(valuesSet).sort((a, b) => b - a);
  for (let i = 0; i < gradient.length; i++) {
    colorMap[orderedValuesList[i]] = gradient[i];
  }
  return colorMap;
}

const handleRegions = (data, colors) => {
  let mapData = [];
  let values = [];
  let keys = data[0];
  for (let i = 1; i < data.length; i++) {
    let region = {};
    for (let j = 0; j < keys.length; j++) {
      region[keys[j]] = data[i][j];
    }
    values.push(region.value);
    mapData.push(region);
  }
  let colorsMap = createColors(values, colors);
  mapData.forEach(r => r.color = colorsMap[r.value]);
  return mapData;
}

const handleData = data => {
  return handleRegions(data[0].values, handleColors(data[1].values));
}

function getMapData(data, settings, colors) {
  const casesByRegion = data.reduce((acc, row) => {
    acc[row[2]] = 1 + (acc[row[2]] || 0);
    return acc;
  }, {});

  console.log('cases', casesByRegion);

  const colorMap = createColors(
    [0, ...Object.values(casesByRegion)],
    colors,
  );

  return Object.entries(settings).map(([id, obj]) => ({
    ...obj,
    value: casesByRegion[id],
    color: colorMap[casesByRegion[id] || 0],
  }));
}

const TileMap = () => {
  useEffect(() => {
    selectedTiles.watch(state => {
      document.querySelectorAll('[data-id]').forEach(el => {
        el.classList.remove(styles['tile-map__selected']);
      });

      if (state.length) {
        const elements = document.getElementsByClassName(styles['tile-map__tile-wrapper']);

        for (const el of elements) {
          if (state.includes(el.attributes['data-id'].value)) {
            el.classList.add(styles['tile-map__selected']);
          }
        }
      }
    });
  }, []);

  const allData = useStore(rawData);
  const socialDataMap = useStore(dataBySocials);
  const settings = useStore(mapSettings);
  const colors = useStore(colorSchema);

  const socials = useStore(socialList);
  const currentSocial = useStore(selectedSocial);

  const data = useMemo(
    () => {
      if (currentSocial === 'Все площадки') {
        return allData;
      }

      return socialDataMap[currentSocial];
    },
    [allData, socialDataMap, currentSocial],
  );

  const mapData = useMemo(
    () => {
      if (
        !data || !data.length ||
        !settings || !Object.keys(settings).length ||
        !colors || !Object.keys(colors).length
      ) {
        return [];
      }

      return getMapData(data, settings, colors);
    },
    [data, settings, colors],
  );

  if (!mapData.length) {
    return 'Загрузка...';
  }

  console.log('mapData', mapData);

  const buildTileMap = (data, mapHeight, mapWidth, svg) => {
    const maxColumns = d3.max(data, d => parseInt(d.col, 10));
    const maxRows = d3.max(data, d => parseInt(d.row, 10));

    const tileWidth = mapWidth / (maxColumns + 1);
    const tileHeight = mapHeight / (maxRows + 1);

    svg.append('g').attr('id', 'tileArea');

    const tile = svg
      .select('#tileArea')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('data-id', d => d[MAP_ID_KEY])
      .on('click', d => setSelectedTiles([d[MAP_ID_KEY]]))
      .classed(styles['tile-map__tile-wrapper'], true);

    tile
      .append('rect')
      .style('fill', d => d.color)
      .attr('width', tileWidth)
      .attr('height', tileHeight)
      .attr('x', d => d.col * tileWidth)
      .attr('y', d => d.row * tileHeight)
      .classed(styles['tile-map__tile'], true);

    tile
      .append('text')
      .attr('x', d => d.col * tileWidth + tileWidth / 5)
      .attr('y', d => d.row * tileHeight + tileHeight / 3)
      .attr('dy', '.35em')
      .text(d => d.region_rus)
      .classed(styles['tile-map__caption'], true);

    tile
      .append('text')
      .attr('x', d => d.col * tileWidth + tileWidth / 5 + 10)
      .attr('y', d => d.row * tileHeight + tileHeight / 3 + 12)
      .attr('dy', '.35em')
      .text(d => d.value)
      .classed(styles['tile-map__caption'], true);

    return svg;
  };

  const onChangeSocial = (e) => {
    setSelectedSocial(e.target.value);
  };

  return (
    <div className={styles.root}>
      <GenericChart
        containerId="TileChart"
        chartWidth={1000}
        chartHeight={500}
        data={mapData}
        buildChart={buildTileMap.bind(null, mapData, 500, 1000)}
      />

      <div className={styles.controls}>
        <select
          name="social"
          onChange={onChangeSocial}
          value={currentSocial}
        >
          {socials.map(social => (
            <option
              key={social}
              value={social}
            >
              {social}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TileMap;
