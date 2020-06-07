import React, { Fragment } from 'react';
import NewsfeedItem from './NewsfeedItem';
import api from '../../api';

import style from './newsfeed.scss';


import { createEvent, createStore, createEffect } from 'effector';
import { useStore } from 'effector-react'

const fetchNewsFx = createEffect({
    handler: async ({ oldNews }) => {
        let news = await loadDocs(oldNews);
        console.log(news);
        return news;
    }
})


const newsStore = createStore([])
    .on(fetchNewsFx.doneData, (oldNews, newNews) => [...oldNews, ...newNews])

fetchNewsFx({oldNews: []})

function loadDocs(oldNews) {

    return api.gsheet.getData({
        ranges: 'LENTA!A' + (2 + oldNews.length) + ':J' + (11 + oldNews.length)
    })
        .then(
            response => {
                let data = response.data.values
                    .map(element =>
                        ({
                            title: element[7],
                            href: element[7],
                            date: element[0],
                            region: element[1],
                            origin: element[6],
                            digest: element[9],
                            source: element[5]
                        })
                    );
                return data
            }
        );
}

const Newsfeed = () => {
    const news = useStore(newsStore);
    return (
        <div className={style.newsfeed}>
            {news.map(item => {
                return (
                    <Fragment key={item.href}>
                        <NewsfeedItem data={item} />
                        <hr />
                    </Fragment>
                );
            })}
            <div className={style.moreButton} onClick={() => fetchNewsFx({oldNews: news})}>Показать ещё</div>
        </div>
    );
}


export default Newsfeed;
