import React from 'react';
import pt from 'prop-types';
import classnames from 'classnames';
import * as d3 from 'd3';
import styles from './BarChartVertical.module.css';
import VisualizationContainer from '../VisualizationContainer';
import tooltipCreator from 'd3Presets/tooltip';

const renderBarChartVertical = (props) => {
  const container = document.getElementById(props.id);
  if (container) {
    container.innerHTML = '';
  }

  const chartData = props.data;
  const margin = { top: 60, right: 80, bottom: 80, left: 40 };
  const height = 800;
  const width = 1600;
  const minBarHeight = 1;
  const yTicksQuantity = 4;
  const yMaxValue = d3.max(chartData, d => d.value);

  const createId = (i, postfix) => `${props.id}_${i}_${postfix}`;
  const createBarId = (i) => createId(i, 'bar');

  const tooltip = tooltipCreator({
    valueLabel: props.staticTooltipValueLabel,
    width,
    height,
    margin
  });
  
  const svg = d3
    .select(`#${props.id}`)
    .append('svg')
    .attr('viewBox', [0, 0, width, height])

  const x = d3
    .scaleBand()
    .domain(d3.range(chartData.length))
    .range([margin.left, width - margin.right])
    .padding(0.3);

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
      .tickValues(x.domain().filter(function(d,i){
        if (chartData.length < 30) return true;
        return !(i % 10);
      }))
      .tickSizeInner(-(height - margin.top))
      .tickFormat(i => chartData.length < 10 ? chartData[i].name : null)
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
          .attr('class', classnames(styles.bar, props.barClassName))
          .attr('x', (d, i) => x(i))
          .attr('y', d => y(d.value))
          .attr('height', d => y(0) - y(d.value) + minBarHeight)
          .attr('width', x.bandwidth())

        g
          .append('rect')
          .attr('class', classnames(styles.barHover))
          .attr('x', (d, i) => x(i))
          .attr('y', '0')
          .attr('height', height - margin.bottom)
          .attr('width', x.bandwidth() + x.step() * x.padding())
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
      if (!props.hideStaticTooltip) tooltip.render(d);
  }

  const barUnhover = (d, i) => {
    svg.selectAll('.' + styles.barHovered).each(function(d, i) {
      this.classList.remove(styles.barHovered, props.barHoveredClassName);
    });
    if (!props.hideStaticTooltip) tooltip.remove();
  }

  xAxisRender();
  yAxisRender();
  svg.append('g').attr('id', tooltip.containerId);
  barsRender();
  if (!props.hideStaticTooltip) barHover(chartData[0], 0);
}

const BarChartVertical = (props) => {
  return (
    <VisualizationContainer
      {...props}
      renderVisualization={renderBarChartVertical}
    />
  )
}

BarChartVertical.defaultProps = {
  xAxisFill: 'white',
  yAxisFill: 'white',
};

BarChartVertical.propTypes = {
  data: pt.instanceOf(Array).isRequired,
  barClassName: pt.string,
  barHoveredClassName: pt.string,
  listLabelClassName: pt.string,
  xAxisClassName: pt.string,
  hideStaticTooltip: pt.bool,
  staticTooltipValueLabel: pt.string
};

export default BarChartVertical;
