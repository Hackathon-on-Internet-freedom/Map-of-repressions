import React, { Fragment } from 'react';
import NewsfeedItem from './NewsfeedItem';
import api from '../../api';

import style from './newsfeed.scss';

function loadDocs(callback, oldNews = []) {

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
                callback(data);
            },
            response => {
                callback([false, response.result.error]);
            },
        );
}

class Newsfeed extends React.Component {



    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = { news: [] };
    }

    componentDidMount() {
        this.loadMore([])
    }

    loadMore(oldNews) {
        loadDocs(docs => {
            console.log(docs);
            this.handleChange([...oldNews, ...docs]);
        }, oldNews);
    }

    handleChange(docs) {
        this.setState({ news: docs });
    }

    render() {
        const news = this.state.news;
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
                <div className={style.moreButton} onClick={() => this.loadMore(news)}>Показать ещё</div>
            </div>
        );
    }
}


export default Newsfeed;
