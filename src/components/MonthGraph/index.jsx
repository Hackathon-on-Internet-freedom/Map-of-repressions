import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';
import * as d3 from 'd3';

import style from './MonthGraph.module.scss';
import { casesByMonths, casesByYears } from '../../utils/effector';

const TITLES = {
  month: 'Показать по годам',
  year: 'Показать по месяцам',
};

function getMonthData(data) {
  const months = Object.entries(data).map(([key, value]) => ({
    date: new Date(`${key}-01`),
    value,
  }));

  months.sort((a, b) => a.date - b.date);

  return months;
}

function getYearData(data) {
  return Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));
}

const MonthGraph = () => {
  const [type, setType] = useState('month');

  const rawMonthData = useStore(casesByMonths);
  const rawYearData = useStore(casesByYears);

  const dataLength = useMemo(
    () => {
      if (type === 'month') {
        return Object.keys(rawMonthData).length;
      } else {
        return Object.keys(rawYearData).length;
      }
    },
    [type, rawMonthData, rawYearData],
  );

  useEffect(
    () => {
      if (type !== 'month') {
        return;
      }

      const container = document.getElementById('mapContentChart');
      if (container) {
        container.innerHTML = '';
      }

      const chartData = getMonthData(rawMonthData);
      const margin = { top: 30, right: 40, bottom: 30, left: 40 };
      const height = 500;
      const width = 1000;
      const svg = d3
        .select('#mapContentChart')
        .append('svg')
        .attr('viewBox', [0, 0, width, height]);

      const x = d3.scaleUtc()
        .domain(d3.extent(chartData, d => d.date))
        .range([margin.left, width - margin.right])

      const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top])

      const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

      const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(chartData.y))

      const line = d3.line()
        .defined(d => !isNaN(d.value))
        .x(d => x(d.date))
        .y(d => y(d.value))

      svg.append("g")
        .call(xAxis);

      svg.append("g")
        .call(yAxis);

      svg.append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
    },
    [type, rawMonthData],
  );

  useEffect(
    () => {
      if (type !== 'year') {
        return;
      }

      const container = document.getElementById('mapContentChart');
      if (container) {
        container.innerHTML = '';
      }

      const chartData = getYearData(rawYearData);
      const margin = { top: 30, right: 40, bottom: 30, left: 40 };
      const height = 500;
      const width = 1000;
      const svg = d3
        .select('#mapContentChart')
        .append('svg')
        .attr('viewBox', [0, 0, width, height]);

      const x = d3
        .scaleBand()
        .domain(d3.range(chartData.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(chartData, d => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const xAxis = g =>
        g.attr('transform', `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .tickFormat(i => chartData[i].name)
            .tickSizeOuter(0),
        );

      const yAxis = g =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(null, chartData.format))
          .call(g => g.select('.domain').remove())
          .call(g =>
            g
              .append('text')
              .attr('x', -margin.left)
              .attr('y', 10)
              .attr('fill', 'currentColor')
              .attr('text-anchor', 'start')
              .text(chartData.y),
          );

      svg
        .append('g')
        .attr('fill', 'steelblue')
        .selectAll('rect')
        .data(chartData)
        .join('rect')
        .attr('x', (d, i) => x(i))
        .attr('y', d => y(d.value))
        .attr('height', d => y(0) - y(d.value))
        .attr('width', x.bandwidth());

      svg.append('g').call(xAxis);

      svg.append('g').call(yAxis);
    },
    [type, rawYearData],
  );

  const onClick = () => {
    setType(type === 'month' ? 'year' : 'month');
  };

  if (dataLength < 2) {
    return 'Загрузка...';
  }

  return (
    <div className={style.root}>
      <button onClick={onClick}>
        { TITLES[type] }
      </button>
      <div id="mapContentChart" />
    </div>
  );
};

export default MonthGraph;
