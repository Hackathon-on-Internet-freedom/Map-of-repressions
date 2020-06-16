import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import moment from 'moment';

import styles from './TileMap.module.scss';
import {
  casesBySocials,
  colorSchema,
  dataBySocials,
  mapSettings,
  rawData,
  selectedSocial,
  selectedTile,
  setSelectedSocial,
  setSelectedTile,
} from '../../utils/effector';
import {
  getMapData,
  ORDER,
  VIEW,
  toggleOrder
} from './utils';
import history from '../../utils/history';
import { startDate, endDate } from '../DatePicker'

import { useStore } from 'effector-react';
import { MAP_ID_KEY } from '../../constants';

function chooseTileColor(d) {
  if (d.value === undefined) return '#777d7e'
  return d.color
}

const TileMap = ({ mapWidth, mapHeight }) => {
  const allData = useStore(rawData);
  const startDateValue = useStore(startDate);
  const endDateValue = useStore(endDate);
  const dateRangedData = allData.filter(element => {
    const date = moment(element[0], 'D.MM.YYYY').toDate();
    return (date >= startDateValue && date <= endDateValue);
  })
  const socialDataMap = useStore(dataBySocials);
  const socialKeys = useStore(casesBySocials);
  const settings = useStore(mapSettings);
  const colors = useStore(colorSchema);
  const currentSocial = useStore(selectedSocial);
  const currentTile = useStore(selectedTile);

  const { location } = window;

  useEffect(
    () => {
      const parts = (location.pathname || '').split('/');
      const id = parts.length && parts[1];

      if (!id) {
        return;
      }

      setSelectedTile(id);
    },
    [location],
  );

  const socials = useMemo(
    () => ([
      'Все площадки',
      ...socialKeys.data.map(({ name }) => name),
    ]),
    [socialKeys.data],
  );

  const mapData = useMemo(
    () => {
      if (currentSocial === 'Все площадки') {
        return dateRangedData;
      } else if (currentSocial === socialKeys.fold.name) {
        return socialKeys.fold.items.reduce((acc, key) => {
          return acc.concat(socialDataMap[key]);
        }, []);
      }

      return socialDataMap[currentSocial].filter(element => {
        const date = moment(element[0], 'D.MM.YYYY').toDate();
        return (date >= startDateValue && date <= endDateValue);
      });
    },
    [dateRangedData, socialDataMap, socialKeys.fold, currentSocial, startDateValue, endDateValue],
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

  const numOfRegions = useMemo(
    () => {
      const regions = {};
      data.forEach(row => {
        regions[row[MAP_ID_KEY]] = true;
      });
      return Object.keys(regions).length;
    },
    [data],
  );

  const [view, setView] = useState({type: VIEW.map, order: ORDER.desc});

  const calcX = useCallback(
    (d, mC) => {
      if (view.type === VIEW.map) return d.col;
      if (view.order === ORDER.desc) return (numOfRegions - 1 - d.rank) % mC;
      return d.rank % mC;
    },
    [view, numOfRegions],
  );

  const calcY = useCallback(
    (d, mC) => {
      if (view.type === VIEW.map) return d.row;
      if (view.order === ORDER.desc) return Math.floor((numOfRegions - 1 - d.rank) / mC);
      return Math.floor(d.rank / mC);
    },
    [view, numOfRegions],
  );

  const calcMapHeight = useCallback(
    () => {
      if (view.type === VIEW.map) return mapHeight;
      return mapHeight * 0.5;
    },
    [view.type, mapHeight],
  );

  useEffect(() => {
    if (!data || !data.length) {
      return;
    }

    const maxColumns = d3.max(data, d => parseInt(d.col, 10));
    const maxRows = d3.max(data, d => parseInt(d.row, 10));

    const tileWidth = mapWidth / (maxColumns + 1);
    const tileHeight = mapHeight / (maxRows + 1);

    d3.select('#TileChart').selectAll('*').remove();
    const svg = d3.select('#TileChart').append('svg');
    svg.attr('width', mapWidth).attr('height', calcMapHeight());
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
      .style('fill', d => chooseTileColor(d))
      .attr('width', tileWidth)
      .attr('height', tileHeight)
      .attr('x', d => calcX(d, maxColumns) * tileWidth)
      .attr('y', d => calcY(d, maxColumns) * tileHeight)
      .classed(styles['tile-map__tile'], true);

    tile
      .append('text')
      .attr('x', d => calcX(d, maxColumns) * tileWidth + tileWidth * 0.1)
      .attr('y', d => calcY(d, maxColumns) * tileHeight + tileHeight * 0.8)
      .attr('dy', '.35em')
      .text(d => d.region_rus)
      .classed(styles['tile-map__caption'], true);

    tile
      .append('text')
      .attr('x', d => calcX(d, maxColumns) * tileWidth + tileWidth * 0.1)
      .attr('y', d => calcY(d, maxColumns) * tileHeight + tileHeight * 0.3)
      .attr('dy', '.35em')
      .text(d => d.value || 0)
      .classed(styles['tile-map__caption_val'], true);

    tile
      .on('mouseover', function(d) {
        let elements = document.getElementById('block');
        elements.style.opacity = 1;
        elements.style.left = d3.event.pageX + 10 + 'px';
        elements.style.top = d3.event.pageY + 'px';
        elements.style.fill = '#949494'
        let elementRegion = document.getElementById('textRegion');
        elementRegion.textContent = d.region;
        let elementCount = document.getElementById('textCount');
        elementCount.textContent = 'Количество случаев: ' + (d.value || 0);
        let elementPopulation = document.getElementById('textPopulation');
        elementPopulation.textContent = 'Население: ' + d.population;
      })
      .on('mouseout', function(d) {
        let elements = document.getElementById('block');
        elements.style.opacity = 0;
        elements.style.left = window.innerWidth / 2 + "px";
        elements.style.top = window.innerHeight / 2 + "px";
      })
      .on('click', (d) => {
        setSelectedTile(d[MAP_ID_KEY]);
        const path = selectedTile.getState()
          ? d[MAP_ID_KEY]
          : '';
        history.push('/' + path);
      })
      .classed(styles['tile-map__tile-wrapper'], true)
      .classed(styles['tile-map__selected'], d => d[MAP_ID_KEY] === currentTile);
  }, [view, data, calcMapHeight, calcX, calcY, mapHeight, mapWidth, currentTile]);

  if (!data.length) {
    return 'Загрузка...';
  }

  const onChangeSocial = (e) => {
    setSelectedSocial(e.target.value);
  };

  const sortByFormatter = (o) => {
    if (o === ORDER.desc) return 'убыванию';
    return 'возрастанию';
  }

  return (
    <div className={styles.root}>
      <div id="TileChart" />

      <div className={styles.controls}>
        <button className={styles.mapButton} onClick={() => setView({type: VIEW.tileChart, order: toggleOrder(view.order)})}>
          Сортировать по {sortByFormatter(view.order)}
        </button>
        {view.type === VIEW.tileChart && (
          <button className={styles.mapButton} onClick={() => setView({type: VIEW.map, order: ORDER.desc})}>
            Карта
          </button>
        )}
        <select
          name="social"
          onChange={onChangeSocial}
          value={currentSocial}>
          {socials.map(social => (
            <option
              key={social}
              value={social}>
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
  mapHeight: 600,
  mapWidth: 1200,
}

export default TileMap;
