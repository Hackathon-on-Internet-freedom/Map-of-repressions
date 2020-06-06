import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { withRouter } from "react-router";

import GenericChart from '../GenericChart';

import { getValuesFx } from '../../utils/effector';

class TileMap extends React.Component {
  constructor() {
    super();
    this.state = {}
    this.state.docs = ['Загрузка', 'Загрузка', 'Загрузка', 'Загрузка'];
  }
  componentDidMount() {
    const {id} = this.props.match.params;
    getValuesFx({
      range: 'Stat!A1:E86',
      dateTimeRenderOption: 'SERIAL_NUMBER',
      majorDimension: 'ROWS'
    }).then(data => {
      console.log(data[id])
      this.setState({ docs: data[id] });
    })
  }
  render(){
    return (
      <div>
        <ul>
          <li>{this.state.docs[0]}</li>
          <li>{this.state.docs[1]}</li>
          <li>{this.state.docs[3]}</li>
          <li>{this.state.docs[4]}</li>
        </ul>
      </div>
    );
  }
}

export default withRouter(TileMap);
