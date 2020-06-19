import * as d3 from 'd3';
import _ from 'lodash';
import utils from 'utils';
import styles from './tooltip.module.css';

/**
 * Создает тултип для визуализации.
 * @param {object} ops Объект с параметрами.
 * @param {string} ops.valueLabel Подпись для значения (единицы измерения).
 * @param {object} ops.classnames Объект с именами css классов.
 * @param {string} ops.classnames.tooltipName Название css класса для текста названия значения.
 * @param {string} ops.classnames.tooltipValue Название css класса для текста значения.
 * @param {string} ops.classnames.tooltipValueLabel Название css класса для подписи (ед. изм.) значения.
 */
export default (options) => {
  options.containerId = utils.getUid('container');
  options.id = utils.getUid('tooltip');
  options.classnames = options.classnames || styles;
  options.xOffset = options.width / 2 + options.margin.left;
  options.yOffset = options.height / 3 - options.margin.top;

  const render = (d, ops = {}) => {
    let copyOptions = JSON.parse(JSON.stringify(options));
    ops = _.merge(copyOptions, ops);
    const x = 0;
    const y = 0;
    
    const g = d3
      .select('#' + ops.containerId)
      .append('g')
      .attr('class', ops.classnames.tooltip)
      .attr('id', ops.id)
    
    const text = g  
      .append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('transform', `translate(${ops.xOffset}, ${ops.yOffset})`)
    
    text
      .selectAll('tspan')
      .data(utils.splitStringByLength(d.name, 25))
      .join('tspan')
      .attr('x', x)
      .attr('dy', '1.6em')
      .text((d) => d)
      .attr('class', ops.classnames.tooltipName)
    
    text
      .append('tspan')
      .attr('x', x)
      .attr('dy', '1.6em')
      .attr('class', ops.classnames.tooltipValue)
      .text(d.value)
      
    if (ops.valueLabel) {
      text
        .append('tspan')
        .attr('dx', '.6em')
        .attr('class', ops.classnames.tooltipValueLabel)
        .text(ops.valueLabel)
    }
  }

  const remove = () => {
    const element = document.getElementById(options.id);
    if (element) element.remove();
  }

  const setPosition = (xOffset, yOffset) => {
    d3
      .select('#' + options.id)
      .selectAll('text')
      .attr('transform', `translate(${xOffset}, ${yOffset})`)
  }

  return {
    render,
    remove,
    setPosition,
    id: options.id,
    containerId: options.containerId
  }
}