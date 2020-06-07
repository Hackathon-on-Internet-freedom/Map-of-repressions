import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, XAxis, YAxis, Tooltip, Bar, LabelList } from 'recharts';
import utils from '../../../utils';
import style from './HorizontalBarChart.module.scss';

const HorizontalBarChart = (props) => {
  return (
    <>
      <div className={style.header}>{props.header}</div>
      <BarChart
        width={props.width}
        height={props.height}
        layout="vertical"
        data={props.data}
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
          tick={{
            fontFamily: "'Rostelecom Basis Light', sans-serif",
            fontSize: 16,
            fill: '#c7c7c7'
          }}
          tickFormatter={(value) => utils.limitStringLength(value, 33)}
          {...props.yAxisProps}
        />
        <Tooltip formatter={(value) => [value, ""] } separator="" />
        <Bar dataKey="value" fill="#166600" {...props.barProps}>
          <LabelList
            dataKey="value"
            position="right"
            {...props.labelListProps}
          />
        </Bar>
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
