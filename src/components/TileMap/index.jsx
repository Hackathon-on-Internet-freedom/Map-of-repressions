import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { withRouter } from "react-router";

import GenericChart from '../GenericChart';

import * as styles from './TileMap.scss';
import { getValuesFx } from '../../utils/effector';

class TileMap extends React.Component {
  buildTileMap = (data, mapHeight, mapWidth, svg) => {
    getValuesFx({
      range: 'Stat!B1:D86',
      dateTimeRenderOption: 'SERIAL_NUMBER',
      majorDimension: 'COLUMNS'
    }).then(data1 => {
      let dataDocs = data1;
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
        .on("mouseover", function(d) {
          let elements = document.getElementById('block');
          elements.style.opacity = 1;
          elements.style.left = d.col * tileWidth + 60 + "px";
          elements.style.top  = d.row * tileHeight - 10 + "px";
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
          elements.style.left = window.innerWidth /2 + "px";
          elements.style.top  = window.innerHeight /2 + "px";
        })
        .on("click", (d) => {
          const location = {
            pathname: dataDocs[1].indexOf(d.id_reg),
            state: { fromDashboard: true }
          }
          this.props.history.push(location)
        })


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

      return svg;
    });
  };

  render(){
    return (
      <div>
        <GenericChart
          containerId={this.props.id}
          chartWidth={this.props.width}
          chartHeight={this.props.height}
          data={this.props.data}
          buildChart={this.buildTileMap.bind(null, this.props.data, this.props.height, this.props.width)}
        />
        <div id='block' style={{left: 0, top: 0, opacity:0, position:'absolute', backgroundColor: 'rgb(108, 205, 216,0.7)'}}>
          <h3 id='textRegion'>1</h3>
          <h3 id='textCount'>1</h3>
          <h3 id='textPopulation'>1</h3>
        </div>
      </div>
    );
  }
}

TileMap.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  id: PropTypes.string.isRequired,
};

export default withRouter(TileMap);
