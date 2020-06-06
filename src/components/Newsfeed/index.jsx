import React, { Fragment } from 'react';
import NewsfeedItem from './NewsfeedItem';
import api from '../../api';

import style from './newsfeed.scss';

function loadDocs(callback, oldNews = []) {

    return api.gsheet.getData({
        ranges: 'LENTA!A' + (2 + oldNews.length) + ':J' + (11 + oldNews.length),
        fields: 'sheets',
    })
        .then(
            response => {
                let data = response.data.sheets[0].data[0].rowData
                    .map(i => i.values)
                    .map(element =>
                        ({
                            title: element[7].formattedValue,
                            href: element[7].formattedValue,
                            date: element[0].formattedValue,
                            region: element[1].formattedValue,
                            origin: element[6].formattedValue,
                            digest: element[9].formattedValue,
                            source: element[5].formattedValue
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
