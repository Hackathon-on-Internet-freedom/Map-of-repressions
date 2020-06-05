import React from 'react';
import PropTypes from 'prop-types';

const NewsfeedItem = ({ data }) => {
    console.log(data)
  return (
    <div>
        <h2>{data.title}</h2><br/>
        <a>{data.date} {data.region} {data.origin}</a><br/>
        <a>{data.digest}</a><br/>
        <a>{data.source}</a>
    </div>
  );
};

NewsfeedItem.propTypes = {
  //title: PropTypes.string.isRequired,
  //date: PropTypes.string.isRequired,
  //region: PropTypes.string.isRequired,
  //origin: PropTypes.string.isRequired,
  //digest: PropTypes.string.isRequired,
  //source: PropTypes.string.isRequired,
};

export default NewsfeedItem;