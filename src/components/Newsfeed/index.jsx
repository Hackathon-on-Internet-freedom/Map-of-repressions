import React, { Fragment } from 'react';
import NewsfeedItem from './NewsfeedItem';
import api from '../../api';
import moment from 'moment';

import style from './newsfeed.scss';
import { startDate, endDate } from '../DatePicker'

import { newsData } from '../../utils/effector';

import { createEvent, createStore, createEffect } from 'effector';
import { useStore } from 'effector-react'

const showMoreNews = createEvent('show-more-news');

export const selectedNewsRange = createStore(10)
    .on(showMoreNews, (prevState, payload) => {
        return prevState + 10;
    });

const Newsfeed = () => {
    const range = useStore(selectedNewsRange);
    const start = useStore(startDate);
    const end = useStore(endDate);

    let news = useStore(newsData);

    news = news
        .map(element => ({
            title: element[7],
            href: element[7],
            date: element[0],
            region: element[1],
            origin: element[6],
            digest: element[9],
            source: element[5]
        }))
        .slice(0, range)
        .filter(e => {
            const date = moment(e.date, 'D.MM.YYYY').toDate();
            return (date >= start && date <= end);
        })

    return (
        <div className={style.newsfeed}>
            {news.map(item => {
                return (
                    <Fragment>
                        <NewsfeedItem data={item} />
                        <hr />
                    </Fragment>
                );
            })}
            <div className={style.moreButton} onClick={showMoreNews}>Показать ещё</div>
        </div>
    );
}


export default Newsfeed;
