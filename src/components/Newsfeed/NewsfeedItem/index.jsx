import React from 'react';
import style from './newsfeedItem.scss';

const NewsfeedItem = ({ data }) => {
  return (
    <div  className={style.news} >
        <h4 className={style.title} >{data.title}</h4>
        <a className={style.meta} >{data.date}  {data.region}  {data.origin}</a><br/>
        <a style={{marginTop: "1em"}}>{data.digest}</a><br/>
        <a className={style.sourceLink} href={data.href}>{data.source}</a>
    </div>
  );
};

export default NewsfeedItem;