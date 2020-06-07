import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const Graph = ({ width, height, data }) => {
  return (
    <LineChart
      width={width}
      height={height}
      data={data}
    >
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#82ca9d" dot={false} />
    </LineChart>
  );
};

Graph.defaultProps = {
  width: 900,
  height: 250
}

export default Graph;
