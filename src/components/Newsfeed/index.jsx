import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useStore } from 'effector-react';
import moment from 'moment';

import style from './newsfeed.module.scss';
import { startDate, endDate } from '../DatePicker';
import { newsData } from '../../utils/effector';

import NewsfeedItem from './NewsfeedItem';

const Newsfeed = () => {
  const [range, setRange] = useState(10);
  const start = useStore(startDate);
  const end = useStore(endDate);
  const rawNews = useStore(newsData);

  const { news, count } = useMemo(
    () => {
      const data = rawNews
        .map(element => ({
          title: element[7],
          href: element[7],
          date: element[0],
          region: element[1],
          origin: element[6],
          digest: element[9],
          source: element[5],
        }))
        .filter(e => {
          const date = moment(e.date, 'D.MM.YYYY').toDate();
          return (date >= start && date <= end);
        });

      return {
        news: data.slice(0, range),
        count: data.length,
      };
    },
    [rawNews, range, start, end],
  );

  const onMore = useCallback(
    () => {
      setRange(range + 10);
    },
    [range],
  );

  return (
    <div className={style.newsfeed}>
      {news.map(item => (
        <Fragment key={`${item.title}_${item.href}`}>
          <NewsfeedItem data={item} />
          <hr />
        </Fragment>
      ))}

      {range < count ? (
        <div
          className={style.moreButton}
          onClick={onMore}
        >
          Показать ещё
        </div>
      ) : null}
    </div>
  );
};

export default Newsfeed;
