import React, { useEffect } from 'react';
import _ from 'lodash';
import pt from 'prop-types';

const VisualizationContainer = (props) => {
  const isExistData = _.isArray(props.data) && props.data.length > 0;

  useEffect(() => {
    if (isExistData) props.renderVisualization(props);
  }, [props, isExistData]);
  
  if (!isExistData) {
    return <div>Данные отсутсвуют</div>
  }
  
  return (
    <div id={props.id} />
  )
}

VisualizationContainer.propTypes = {
  id: pt.string.isRequired,
  renderVisualization: pt.func.isRequired
};

export default VisualizationContainer;