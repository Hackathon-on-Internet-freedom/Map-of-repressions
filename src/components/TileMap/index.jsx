import React, { useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import gradstop from 'gradstop';

import styles from './TileMap.scss';
import {
  colorSchema,
  dataBySocials,
  getValuesFx,
  mapSettings,
  rawData,
  selectedSocial,
  selectedTiles,
  setSelectedSocial,
  setSelectedTiles,
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
} from './utils';

import GenericChart from '../GenericChart';
import { useStore } from 'effector-react';
import { MAP_ID_KEY } from '../../constants';

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

function getMapData(data, settings, colors) {
  const casesByRegion = data.reduce((acc, row) => {
    acc[row[2]] = 1 + (acc[row[2]] || 0);
    return acc;
  }, {});

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

const TileMap = ({ mapWidth, mapHeight }) => {
  const [tileData, setTileData] = useState(false);
  useEffect(() => {
    getValuesFx({
      range: 'Stat!B1:D86',
      dateTimeRenderOption: 'SERIAL_NUMBER',
      majorDimension: 'COLUMNS'
    }).then(d => setTileData(d));
  }, []);

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

  const currentSocial = useStore(selectedSocial);

  const socials = useMemo(
    () => (['Все площадки', ...Object.keys(socialDataMap)]),
    [socialDataMap],
  );

  const mapData = useMemo(
    () => {
      if (currentSocial === 'Все площадки') {
        return allData;
      }

      return socialDataMap[currentSocial];
    },
    [allData, socialDataMap, currentSocial],
  );

  const data = useMemo(
    () => {
      if (
        !mapData || !mapData.length ||
        !settings || !Object.keys(settings).length ||
        !colors || !Object.keys(colors).length
      ) {
        return [];
      }

      return getMapData(mapData, settings, colors);
    },
    [mapData, settings, colors],
  );

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
      .attr('data-id', d => d[MAP_ID_KEY]);

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
      .on('mouseover', function(d) {
        let elements = document.getElementById('block');
        elements.style.opacity = 1;
        elements.style.left = d3.event.pageX + 10 + 'px';
        elements.style.top = d3.event.pageY + 'px';
        let elementRegion = document.getElementById('textRegion');
        elementRegion.textContent = d.region;
        let elementCount = document.getElementById('textCount');
        elementCount.textContent = 'Количество случаев: ' + (d.value || 0);
        let elementPopulation = document.getElementById('textPopulation');
        elementPopulation.textContent = 'Население: ' + tileData[2][tileData[1].indexOf(d[MAP_ID_KEY])];
      })
      .on('mouseout', function(d) {
        let elements = document.getElementById('block');
        elements.style.opacity = 0;
        elements.style.left = window.innerWidth / 2 + "px";
        elements.style.top = window.innerHeight / 2 + "px";
      })
      .on('click', (d) => {
        setSelectedTiles([d[MAP_ID_KEY]]);
        history.push('/' + tileData[1].indexOf(d[MAP_ID_KEY]));
      })
      .classed(styles['tile-map__tile-wrapper'], true);

    return svg;
  };

  if (!data.length) {
    return 'Загрузка...';
  }

  const onChangeSocial = (e) => {
    setSelectedSocial(e.target.value);
  };

  return (
    <div className={styles.root}>
      <button onClick={() => setView({type: VIEW.tileChart, order: toggleOrder(view.order)})}>Sort by {view.order}</button>
      {view.type === VIEW.tileChart && <button onClick={() => setView({type: VIEW.map, order: ORDER.desc})}>Map View</button>}
      <div id="TileChart" />

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

      <div id='block' className={styles.tooltip}>
        <div id='textRegion' />
        <div id='textCount' />
        <div id='textPopulation' />
      </div>
    </div>
  );
};

TileMap.defaultProps = {
  mapHeight: 500,
  mapWidth: 1000,
}

export default TileMap;
