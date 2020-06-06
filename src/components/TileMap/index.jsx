import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import gradstop from 'gradstop';

import styles from './TileMap.scss';
import { getMapValues, selectedTile, setSelectedTile } from '../../utils/effector';

import GenericChart from '../GenericChart';

const MAP_SHEET_ID = '1Ak5b1x9Qf7yDw9f3uXliCG3PghE1JpJwPUGhsGF2VoE';
const API_KEY = 'AIzaSyCv-UFnDjRvdIR34CQjOlwM4R3gxAoh3Iw';

const handleColors = data => {
  return {'hot': data[0][0], 'cold': data[0][1]};
}

const cookMetadata = (values, colors) => {
  let metadata = {}
  const valuesSet = new Set(values);
  const gradient = gradstop({
    stops: valuesSet.size,
    inputFormat: 'hex',
    colorArray: [colors.hot, colors.cold]
  });
  const orderedValuesList = Array.from(valuesSet).sort().reverse();
  for (let i = 0; i < gradient.length; i++) {
    metadata[orderedValuesList[i]] = {color: gradient[i], rank: i}

  }
  return metadata;
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
  let metadata = cookMetadata(values, colors);
  mapData.forEach(r => {
    r.color = metadata[r.value].color;
    r.rank = metadata[r.value].rank;
  });
  if (mapData.view === undefined) {
    mapData.view = {type: VIEW.map}
  }
  return mapData;
}

const handleData = data => {
  return handleRegions(data[0].values, handleColors(data[1].values));
}

const ORDER = {
  asc: 'ASC',
  desc: 'DESC'
}

const VIEW = {
  map: 'MAP',
  tileChart: 'Tiles'
}

const toggleOrder = order => {
  if (order === ORDER.asc) {return ORDER.desc}
  return ORDER.asc;
}

const TileMap = () => {
  const [data, setData] = useState(false);
  useEffect(() => {
    getMapValues({
      apiKey: API_KEY,
      ranges: ['A1:J86', 'M2:N2'],
      majorDimension: 'ROWS',
      spreadsheetId: MAP_SHEET_ID,
    }).then(data => {
      setData(handleData(data))
    });
  }, []);

  useEffect(() => {
    selectedTile.watch(state => {
      document.querySelectorAll('[data-id]').forEach(el => {
        el.classList.remove(styles['tile-map__selected']);
      });

      if (state) {
        document.querySelector(`[data-id=${state}]`)
          .classList.add(styles['tile-map__selected']);
      }
    });
  }, []);

  const [view, setView] = useState({type: VIEW.map, order: ORDER.desc});

  if (!data) {
    return 'Загрузка...';
  }

  const buildTileMap = (data, mapHeight, mapWidth, view, svg) => {
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
      .attr('data-id', d => d.id_reg)
      .on('click', d => setSelectedTile(d.id_reg))
      .classed(styles['tile-map__tile-wrapper'], true);

    if (view.type === VIEW.map) {
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
    } else {
      console.log("I want see it work!!!!");
    }

    return svg;
  };

  const updateView = view => {
    setView(view);
    buildTileMap.bind(null, data, 500, 1000, view);
  }

  return (
    <div>
      <button onClick={() => setView({type: VIEW.tileChart, order: toggleOrder(view.order)})}>Sort by {view.order}</button>
      {view.type === VIEW.tileChart && <button onClick={() => setView({type: VIEW.map, order: ORDER.desc})}>Map View</button>}
      <GenericChart
        containerId="TileChart"
        chartWidth={1000}
        chartHeight={500}
        data={data}
        buildChart={buildTileMap.bind(null, data, 500, 1000, view)}
      />
    </div>
  )
};

export default TileMap;
