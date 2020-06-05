import React from 'react';
import PropTypes from 'prop-types';
import NewsfeedItem from './NewsfeedItem';

function initClient(callback) {
    // 2. Initialize the JavaScript client library.
    window.gapi.client
        .init({
            apiKey: 'AIzaSyCKivLrYYPmTIMuJr_QB_Y6-LXmVz-YoTs',
            // Your API key will be automatically added to the Discovery Document URLs.
            discoveryDocs: [
                'https://sheets.googleapis.com/$discovery/rest?version=v4',
            ],
        })
        .then(() => {
            // 3. Initialize and make the API request.
            loadDocs(callback);
        });
}

function init(callback) {
    window.gapi.load('client', () => initClient(callback));
}

function loadDocs(callback, oldNews = []) {

    window.gapi.client.load('sheets', 'v4', () => {
        window.gapi.client.sheets.spreadsheets.values
            .get({
                spreadsheetId: '1HRQmWpdrt0kmFvCv4Auk66QxSGJahh0_06wV5rTYRb8',
                range: 'LENTA!A'+(2+oldNews.length)+':J'+(11+oldNews.length),
                dateTimeRenderOption: 'SERIAL_NUMBER',
                majorDimension: 'ROWS'
            })
            .then(
                response => {
                    let data = [];
                    //console.log(response.result.values);
                    response.result.values.forEach(element => {
                        //console.log(element);
                        data.push({
                            title: element[7],
                            date: element[0],
                            region: element[1],
                            origin: element[6],
                            digest: element[9],
                            source: element[5]
                        })
                    });
                    callback(data);
                },
                response => {
                    callback([false, response.result.error]);
                },
            );
    });
}

class Newsfeed extends React.Component {



    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = { news: [] };
    }

    componentDidMount() {
        init(docs => {
            console.log(docs);
            this.handleChange(docs)
        });
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
            <div>
                {news.map(item => {
                    console.log(item);
                    return <NewsfeedItem key={item} data={item} />;
                })}
                <button onClick={() => this.loadMore(news)}>Показать ещё...</button>
            </div>
        );
    }
}


export default Newsfeed;