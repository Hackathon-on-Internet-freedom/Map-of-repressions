import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import gradstop from 'gradstop';
import { useHistory } from "react-router-dom";
import styles from './TileMap.scss';
import { getMapValues, selectedTile, setSelectedTile, getValuesFx } from '../../utils/effector';
import history from "../../utils/history";

import GenericChart from '../GenericChart';

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
  const orderedValuesList = Array.from(valuesSet).sort().reverse();
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

  if (!data) {
    return 'Загрузка...';
  }

  const buildTileMap = (data, mapHeight, mapWidth, svg) => {
    getValuesFx({
      range: 'Stat!B1:D86',
      dateTimeRenderOption: 'SERIAL_NUMBER',
      majorDimension: 'COLUMNS'
    }).then(dataDocs => {
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
        .on("mouseover", function(d) {
          let elements = document.getElementById('block');
          elements.style.opacity = 1;
          elements.style.left = d3.event.pageX + 10 + "px";
          elements.style.top = d3.event.pageY + "px";
          let elementRegion = document.getElementById('textRegion');
          elementRegion.textContent = d.region;
          let elementCount = document.getElementById('textCount');
          elementCount.textContent = 'Количество случаев ' + dataDocs[0][dataDocs[1].indexOf(d.id_reg)];
          let elementPopulation = document.getElementById('textPopulation');
          elementPopulation.textContent = 'Население ' + dataDocs[2][dataDocs[1].indexOf(d.id_reg)];
        })
        .on("mouseout", function(d) {
          let elements = document.getElementById('block');
          elements.style.opacity = 0;
          elements.style.left = window.innerWidth / 2 + "px";
          elements.style.top = window.innerHeight / 2 + "px";
        })
        .on("click", (d) => {
          setSelectedTile(d.id_reg)
          history.push('/' + dataDocs[1].indexOf(d.id_reg))
        })
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
    })
  };

  return (
    <div>
    <GenericChart
      containerId="TileChart"
      chartWidth={1000}
      chartHeight={500}
      data={data}
      buildChart={buildTileMap.bind(null, data, 500, 1000)}
    />
      <div id='block' style={{left: 0, top: 0, opacity:0, position:'absolute', backgroundColor: 'rgb(108, 205, 216,0.7)'}}>
        <h3 id='textRegion'>1</h3>
        <h3 id='textCount'>1</h3>
        <h3 id='textPopulation'>1</h3>
      </div>
    </div>
  );
};

export default TileMap;
