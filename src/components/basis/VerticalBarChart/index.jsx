import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, XAxis, YAxis, Tooltip, Bar, LabelList, ResponsiveContainer } from 'recharts';
import style from './VerticalBarChart.module.scss';

const VerticalBarChart = (props) => {
  return (
    <>
      { props.header && <div className={style.header}>{props.header}</div> }
      <ResponsiveContainer width={props.width} height={props.height}>
        <BarChart data={props.data}>
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{
              fontFamily: "'Rostelecom Basis Light', sans-serif",
              fontSize: 16,
              fill: '#c7c7c7'
            }}
            {...props.xAxisProps}
            />
          <YAxis
            hide
            padding={{ top: 50 }}
            dataKey="value"
            interval={0}
            tickLine={false}
            axisLine={false}
            tick={{
              fontFamily: "'Rostelecom Basis Light', sans-serif",
              fontSize: 16,
              fill: '#c7c7c7'
            }}
            {...props.yAxisProps}
          />
          {
            props.hideTooltip ? null :
            <Tooltip
              formatter={(value) => [value, ""] }
              separator=""
              {...props.tooltipProps}
            />
          }
          <Bar dataKey="value" fill="#166600" {...props.barProps}>
            {
              props.hideLabelList ? null :
              <LabelList
                fontSize={16}
                fontFamily="'Rostelecom Basis Light', sans-serif"
                fill="#c7c7c7"
                dataKey="value"
                position="top"
                {...props.labelListProps}
              />
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}

VerticalBarChart.defaultProps = {
  yAxisProps: {},
  xAxisProps: {},
  barProps: {}
};

VerticalBarChart.propTypes = {
  header: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  width: PropTypes.number,
  data: PropTypes.instanceOf(Array).isRequired,
};

export default VerticalBarChart;
