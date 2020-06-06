import React from 'react';
import PropTypes from 'prop-types';
import style from './newsfeedItem.scss';

const NewsfeedItem = ({ data }) => {
  return (
    <div  className={style.news} >
        <h4 style={{marginTop: "0px", marginBottom: "0.5em"}}>{data.title}</h4>
        <a  className={style.meta} >{data.date}  {data.region}  {data.origin}</a><br/>
        <a style={{marginTop: "1em"}}>{data.digest}</a><br/>
        <a className={style.sourceLink} href={data.href}>{data.source}</a>
    </div>
  );
};

export default NewsfeedItem;