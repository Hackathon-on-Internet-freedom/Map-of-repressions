import React, { useEffect, useMemo } from 'react';
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
  socialList,
} from '../../utils/effector';
import history from '../../utils/history';

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

  const buildTileMap = (data, mapHeight, mapWidth, svg) => {
    return getValuesFx({
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
        .attr('data-id', d => d[MAP_ID_KEY])
        .on('mouseover', function(d) {
          let elements = document.getElementById('block');
          elements.style.opacity = 1;
          elements.style.left = d3.event.pageX + 10 + 'px';
          elements.style.top = d3.event.pageY + 'px';
          let elementRegion = document.getElementById('textRegion');
          elementRegion.textContent = d.region;
          let elementCount = document.getElementById('textCount');
          elementCount.textContent = 'Количество случаев: ' + dataDocs[0][dataDocs[1].indexOf(d[MAP_ID_KEY])];
          let elementPopulation = document.getElementById('textPopulation');
          elementPopulation.textContent = 'Население: ' + dataDocs[2][dataDocs[1].indexOf(d[MAP_ID_KEY])];
        })
        .on('mouseout', function(d) {
          let elements = document.getElementById('block');
          elements.style.opacity = 0;
          elements.style.left = window.innerWidth / 2 + "px";
          elements.style.top = window.innerHeight / 2 + "px";
        })
        .on('click', (d) => {
          setSelectedTiles([d[MAP_ID_KEY]]);
          history.push('/' + dataDocs[1].indexOf(d[MAP_ID_KEY]));
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

      <div id='block' className={styles.tooltip}>
        <div id='textRegion' />
        <div id='textCount' />
        <div id='textPopulation' />
      </div>
    </div>
  );
};

export default TileMap;
