import React from 'react';
import PropTypes from 'prop-types';

const NewsfeedItem = ({ data }) => {
    console.log(data)
  return (
    <div>
        <h3 style={{marginTop: "0px", marginBottom: "0.5em"}}>{data.title}</h3>
        <a>{data.date}  {data.region}  {data.origin}</a><br/>
        <a style={{marginTop: "1em"}}>{data.digest}</a><br/>
        <a href={data.href}>{data.source}</a>
    </div>
  );
};

export default NewsfeedItem;