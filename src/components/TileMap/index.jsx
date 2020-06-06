import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { getMapValues } from '../../utils/effector';
import GenericChart from '../GenericChart';
import * as styles from './TileMap.scss';

const MAP_SHEET_ID = '1Ak5b1x9Qf7yDw9f3uXliCG3PghE1JpJwPUGhsGF2VoE';
const API_KEY = 'AIzaSyCv-UFnDjRvdIR34CQjOlwM4R3gxAoh3Iw';

function handleData(data) {
  let mapData = [];
  let keys = data[0];
  for (let i = 1; i < data.length; i++) {
    let region = {};
    for (let j = 0; j < keys.length; j++) {
      region[keys[j]] = data[i][j];
    }
    mapData.push(region);
  }
  return mapData;
}

const TileMap = () => {
  const [data, setData] = useState(false);
  useEffect(() => {
    getMapValues({
      apiKey: API_KEY,
      range: 'A1:J86',
      majorDimension: 'ROWS',
      spreadsheetId: MAP_SHEET_ID,
    }).then(data => {
      setData(handleData(data))
    });
  }, []);

  if (!data) {
    return 'Загрузка...';
  }

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
      .append('g');

    tile
      .append('rect')
      .style('fill', '#8aebf6')
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

  return (
    <GenericChart
      containerId="TileChart"
      chartWidth={1000}
      chartHeight={500}
      data={data}
      buildChart={buildTileMap.bind(null, data, 500, 1000)}
    />
  );
};

TileMap.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  id: PropTypes.string.isRequired,
};

export default TileMap;
