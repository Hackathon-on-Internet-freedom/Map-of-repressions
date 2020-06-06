import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from 'recharts';
import utils from '../../utils';

const HorizontalBarChart = (props) => {
  return (
    <>
      <h2>{props.header}</h2>
      <BarChart
        width={props.width}
        height={props.height}
        layout="vertical"
        data={props.data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          {...props.xAxisProps}
        />
        <YAxis
          type="category"
          dataKey="name"
          interval={0}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => utils.limitStringLength(value, 33)}
          {...props.yAxisProps}
        />
        <Tooltip formatter={(value) => [value, ""] } separator="" />
        <Bar dataKey="value" fill="royalblue" {...props.barProps}  />
      </BarChart>
    </>
  )
}

HorizontalBarChart.defaultProps = {
  yAxisProps: {},
  xAxisProps: {},
  barProps: {}
};

HorizontalBarChart.propTypes = {
  header: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
};

export default HorizontalBarChart;
