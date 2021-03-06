import React from 'react';
import classnames from 'classnames';
import * as d3 from 'd3';
import VisualizationContainer from '../VisualizationContainer';
import styles from 'components/basis/BarChartVertical/BarChartVertical.module.css';
import stylesGraph from './Graph.module.css';
import tooltipCreator from 'd3Presets/tooltip';

d3.timeFormatDefaultLocale({
  "dateTime": "%A, %e %B %Y г. %X",
  "date": "%d.%m.%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
  "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
  "months": ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
  "shortMonths": ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
});

function formatNameToDate(data) {
  return data.map(({ name, value }) => ({
    date: new Date(name),
    value
  }));
}

const renderGraph = (props) => {
  const container = document.getElementById(props.id);
  if (container) {
    container.innerHTML = '';
  }

  const chartData = formatNameToDate(props.data);
  const margin = { top: 80, right: 80, bottom: 80, left: 80 };
  const height = 800;
  const width = 1600;
  const minBarHeight = 1;
  const yTicksQuantity = 4;
  const yMaxValue = d3.max(chartData, d => d.value);
  
  const createId = (i, postfix) => `${props.id}_${i}_${postfix}`;
  const createBarId = (i) => createId(i, 'bar');

  const tooltip = tooltipCreator({
    width,
    height,
    margin
  });

  const svg = d3
    .select(`#${props.id}`)
    .append('svg')
    .attr('viewBox', [0, 0, width, height])

  const x = d3
    .scaleUtc()
    .domain(d3.extent(chartData, d => d.date))
    .range([margin.left, width - margin.right])

  const y = d3
    .scaleLinear()
    .domain([0, yMaxValue])
    .nice(yTicksQuantity)
    .range([height - margin.bottom, margin.top]);

  const xAxisRender = () => {
    const g = svg.append('g');
    g
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .attr('class', classnames(styles.xAxis, props.xAxisClassName))
    .call(
      d3
      .axisBottom(x)
      .ticks(9)
      .tickSizeInner(-(height - margin.top))
    )
  }

  const yAxisRender = () => {
    const g = svg.append('g');
    g
      .attr('class', styles.yAxis)
      .call(
        d3
          .axisRight(y)
          .ticks(yTicksQuantity)
          .tickFormat(v => {
            if (v === 0) return '';
            if (v < 10 && v % 1 === 0) return v + '.0';
            return v;
          })
      )
    g
      .selectAll('line')
      .attr("x1", 0 - margin.left)
      .attr("x2", width)
    g
      .selectAll('text')
      .attr('x', width - margin.right + 20)
  }

  const lineRender = () => {
    const line = d3.line()
      .defined(d => !isNaN(d.value))
      .x(d => x(d.date))
      .y(d => y(d.value))

    svg
      .append('g')
      .append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "#51974a")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
  }

  const barsRender = () => {
    svg
      .append('g')
      .selectAll('rect')
      .data(chartData)
      .enter()
      .call(g => {
        g
          .append('rect')
          .attr('id', (d, i) => createBarId(i))
          .attr('class', classnames(stylesGraph.bar, props.barClassName))
          .attr('x', (d, i) => x(d.date))
          .attr('y', d => y(d.value))
          .attr('height', d => y(0) - y(d.value) + minBarHeight)
          .attr('width', width / chartData.length)

        g
          .append('rect')
          .attr('class', classnames(styles.barHover))
          .attr('x', (d, i) => x(d.date))
          .attr('y', '0')
          .attr('height', height - margin.bottom)
          .attr('width', width / chartData.length)
          .on('mouseenter', barHover)
          .on('mouseout', barUnhover)

        g
          .append('text')
          .attr('class', classnames(styles.listLabel, props.listLabelClassName))
          .attr('x', (d, i) => x(i))
          .attr('y', d => y(d.value))
          .text(d => d.value)
      })
  }

  const barHover = (d, i) => {
    barUnhover(d, i);
    document.getElementById(createBarId(i)).classList
      .add(...([styles.barHovered, props.barHoveredClassName].filter(v => v)));

    tooltip.render(
      {
        value: d.date.toLocaleDateString(),
        name: String(d.value)
      },
      {
        xOffset: x(d.date),
        yOffset: y(d.value) - 90,
        classnames: {
          tooltipName: stylesGraph.tooltipName,
          tooltipValue: stylesGraph.tooltipValue
        }
      }
    );
  }

  const barUnhover = (d, i) => {
    svg.selectAll('.' + styles.barHovered).each(function(d, i) {
      this.classList.remove(styles.barHovered, props.barHoveredClassName);
    });
    tooltip.remove();
  }

  xAxisRender();
  yAxisRender();
  lineRender();
  svg.append('g').attr('id', tooltip.containerId);
  barsRender();
}

const Graph = (props) => {
  return (
    <VisualizationContainer
      {...props}
      renderVisualization={renderGraph}
    />
  )
};

Graph.defaultProps = {
  
};

export default Graph;
