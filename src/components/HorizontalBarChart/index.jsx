import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import utils from '../../utils';
import style from './HorizontalBarChart.scss';

const HorizontalBarChart = (props) => {
  const data = props.data.sort((a, b) => b.value - a.value);

  return (
    <>
      <div className={style.header}>{props.header}</div>
      <BarChart
        width={props.width}
        height={props.height}
        layout="vertical"
        data={data}
      >
        <XAxis
          hide
          type="number"
          {...props.xAxisProps}
        />
        <YAxis
          type="category"
          dataKey="name"
          interval={0}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 16 }}
          tickFormatter={(value) => utils.limitStringLength(value, 33)}
          {...props.yAxisProps}
        />
        <Tooltip formatter={(value) => [value, ""] } separator="" />
        <Bar dataKey="value" fill="#166600" {...props.barProps}  />
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
