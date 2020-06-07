import React from 'react';
import style from './newsfeedItem.module.scss';

const NewsfeedItem = ({ data }) => {
  return (
    <div  className={style.news} >
        <h4 className={style.title}>
          {data.title}
        </h4>
        <p className={style.meta}>
          {data.date} {data.region} {data.origin}
        </p>
        <p className={style.body}>
          {data.digest}
        </p>
        <a className={style.sourceLink} href={data.href}>
          {data.source}
        </a>
    </div>
  );
};

export default NewsfeedItem;
