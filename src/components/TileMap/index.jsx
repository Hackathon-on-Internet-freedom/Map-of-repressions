import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import styles from './TileMap.scss';
import {
  getMapValues,
  getValuesFx,
  selectedTile,
  setSelectedTile
} from '../../utils/effector';
import {
  handleColors,
  handleRegions,
  MAP_SHEET_ID,
  NUMBER_OF_REGIONS,
  API_KEY,
  ORDER,
  VIEW,
  toggleOrder
} from "./utils";


const handleData = data => {
  return handleRegions(data[0].values, handleColors(data[1].values));
}

const TileMap = ({ mapWidth, mapHeight }) => {
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

  const [tileData, setTileData] = useState(false);
  useEffect(() => {
    getValuesFx({
      range: 'Stat!B1:D86',
      dateTimeRenderOption: 'SERIAL_NUMBER',
      majorDimension: 'COLUMNS'
    }).then(d => setTileData(d))}, []);

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
  useEffect(() => {
    if (data) buildTileMap();
  }, [view, data, tileData]);

  const calcX = (d, mC) => {
    if (view.type === VIEW.map) return d.col;
    if (view.order === ORDER.desc) return (NUMBER_OF_REGIONS - 1 - d.rank) % mC;
    return d.rank % mC;
  }

  const calcY = (d, mC) => {
    if (view.type === VIEW.map) return d.row;
    if (view.order === ORDER.desc) return Math.floor((NUMBER_OF_REGIONS - 1 - d.rank) / mC);
    return Math.floor(d.rank / mC);
  }

  const buildTileMap = () => {
    const maxColumns = d3.max(data, d => parseInt(d.col, 10));
    const maxRows = d3.max(data, d => parseInt(d.row, 10));

    const tileWidth = mapWidth / (maxColumns + 1);
    const tileHeight = mapHeight / (maxRows + 1);

    d3.select('#TileChart').selectAll('*').remove();
    const svg = d3.select('#TileChart').append('svg');
    svg.attr('width', mapWidth).attr('height', mapHeight);
    svg.append('g').attr('id', 'tileArea');

    const tile = svg
      .select('#tileArea')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('data-id', d => d.id_reg);

    tile
      .append('rect')
      .style('fill', d => d.color)
      .attr('width', tileWidth)
      .attr('height', tileHeight)
      .attr('x', d => calcX(d, maxColumns) * tileWidth)
      .attr('y', d => calcY(d, maxColumns) * tileHeight)
      .classed(styles['tile-map__tile'], true);

    tile
      .append('text')
      .attr('x', d => calcX(d, maxColumns) * tileWidth + tileWidth / 5)
      .attr('y', d => calcY(d, maxColumns) * tileHeight + tileHeight / 3)
      .attr('dy', '.35em')
      .text(d => d.region_rus)
      .classed(styles['tile-map__caption'], true);

    tile
      .append('text')
      .attr('x', d => calcX(d, maxColumns) * tileWidth + tileWidth / 5 + 10)
      .attr('y', d => calcY(d, maxColumns) * tileHeight + tileHeight / 3 + 12)
      .attr('dy', '.35em')
      .text(d => d.value)
      .classed(styles['tile-map__caption'], true);

    tile
      .on("mouseover", function(d) {
        let elements = document.getElementById('block');
        elements.style.opacity = 1;
        elements.style.left = d3.event.pageX + 10 + "px";
        elements.style.top = d3.event.pageY + "px";
        let elementRegion = document.getElementById('textRegion');
        elementRegion.textContent = d.region;
        let elementCount = document.getElementById('textCount');
        elementCount.textContent = 'Количество случаев ' + tileData[0][tileData[1].indexOf(d.id_reg)];
        let elementPopulation = document.getElementById('textPopulation');
        elementPopulation.textContent = 'Население ' + tileData[2][tileData[1].indexOf(d.id_reg)];
      })
      .on("mouseout", function(d) {
        let elements = document.getElementById('block');
        elements.style.opacity = 0;
        elements.style.left = window.innerWidth / 2 + "px";
        elements.style.top = window.innerHeight / 2 + "px";
      })
      .on("click", (d) => {
        setSelectedTile(d.id_reg)
        history.push('/' + tileData[1].indexOf(d.id_reg))
      }).classed(styles['tile-map__tile-wrapper'], true);

      return svg;
  }
  
  if (!data) {
    return 'Загрузка...';
  }

  return (
    <div>
      <button onClick={() => setView({type: VIEW.tileChart, order: toggleOrder(view.order)})}>Sort by {view.order}</button>
      {view.type === VIEW.tileChart && <button onClick={() => setView({type: VIEW.map, order: ORDER.desc})}>Map View</button>}
      <div id="TileChart" />
      <div id='block' style={{left: 0, top: 0, opacity:0, position:'absolute', backgroundColor: 'rgb(108, 205, 216,0.7)'}}>
        <h3 id='textRegion'>1</h3>
        <h3 id='textCount'>1</h3>
        <h3 id='textPopulation'>1</h3>
      </div>
    </div>
  )
};

TileMap.defaultProps = {
  mapHeight: 500,
  mapWidth: 1000,
}

export default TileMap;
