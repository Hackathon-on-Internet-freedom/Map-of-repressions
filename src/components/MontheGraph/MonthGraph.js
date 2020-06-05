import React from 'react';
import * as d3 from 'd3';

function loadDocs(callback) {
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: '1HRQmWpdrt0kmFvCv4Auk66QxSGJahh0_06wV5rTYRb8',
        range: 'LENTA!A1:A1038',
        dateTimeRenderOption: 'SERIAL_NUMBER',
        majorDimension: 'COLUMNS'
      })
      .then(
        response => {
          const data = response.result.values;
          const cars =
            data.map(car => ({
              year: car[0],
              make: car[1],
              model: car[2],
            })) || [];
          callback([data, false]);
        },
        response => {
          callback([false, response.result.error]);
        },
      );
  });
}

class MonthGraph extends React.Component {
  constructor() {
    super();
    this.state = {}
    this.state.docs = [[]];
    this.state.type = 'month'
    this.state.countCharts = 0;
  }

  componentDidMount() {
    // 1. Load the JavaScript client library.
    window.gapi.load('client', this.initClient);
  }

  onLoad = (data, error) => {
    const cars = data[0]
    if (data) {
      this.setState({ docs: cars } );
    } else {
      this.setState({ error });
    }
  }

  initClient = () => {
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
        loadDocs(this.onLoad);
      });
  }

  arrayBarFormat = () => {
    let data = {}
    let returnedData = []
    for (let i = 1; i < this.state.docs['0'].length-1; i++) {
      if (data[this.state.docs['0'][i][6]+ this.state.docs['0'][i][7]+
      this.state.docs['0'][i][8]+ this.state.docs['0'][i][9]]) {
        data[this.state.docs['0'][i][6]+ this.state.docs['0'][i][7]+
        this.state.docs['0'][i][8]+ this.state.docs['0'][i][9]] += 1;
      } else {
        data[this.state.docs['0'][i][6]+ this.state.docs['0'][i][7]+
        this.state.docs['0'][i][8]+ this.state.docs['0'][i][9]] = 1;
      }
    }
    Object.keys(data).forEach(function(key) {
      console.log(key, data[key]);
      returnedData.push({name: key[0] + key[1] + key[2] + key[3], value: data[key]})
    });
    return returnedData
  }

  arrayLineFormat = () => {
    let data = {}
    let returnedData = []
    for (let i = 1; i < this.state.docs['0'].length-1; i++) {
      if (data[this.state.docs['0'][i][3] + this.state.docs['0'][i][4]+
      this.state.docs['0'][i][5]+ this.state.docs['0'][i][6]+ this.state.docs['0'][i][7]+
      this.state.docs['0'][i][8]+ this.state.docs['0'][i][9]]) {
        data[this.state.docs['0'][i][3] + this.state.docs['0'][i][4]+
        this.state.docs['0'][i][5]+ this.state.docs['0'][i][6]+ this.state.docs['0'][i][7]+
        this.state.docs['0'][i][8]+ this.state.docs['0'][i][9]] += 1;
      } else {
        data[this.state.docs['0'][i][3] + this.state.docs['0'][i][4]+
        this.state.docs['0'][i][5]+ this.state.docs['0'][i][6]+ this.state.docs['0'][i][7]+
        this.state.docs['0'][i][8]+ this.state.docs['0'][i][9]] = 1;
      }
    }
    Object.keys(data).forEach(function(key) {
      returnedData.push({date: new Date(key[3]+key[4]+key[5]+key[6]+'-'+key[0]+key[1]+'-'+'01'), value: data[key]})
    });
    returnedData.sort(function(a, b) {
      return a.date - b.date;
    });
    return returnedData
  }

  renderBarChart = () => {
    this.data = this.arrayBarFormat()
    const margin = { top: 30, right: 40, bottom: 30, left: 40 };
    const height = 500;
    const width = 1000;
    const svg = d3
      .select('#mapContentChart')
      .append('svg')
      .attr('viewBox', [0, 0, width, height])
      .attr('id', this.state.countCharts);

    const x = d3
      .scaleBand()
      .domain(d3.range(this.data.length))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = g =>
      g.attr('transform', `translate(0,${height - margin.bottom})`).call(
        d3
          .axisBottom(x)
          .tickFormat(i => this.data[i].name)
          .tickSizeOuter(0),
      );

    const yAxis = g =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, this.data.format))
        .call(g => g.select('.domain').remove())
        .call(g =>
          g
            .append('text')
            .attr('x', -margin.left)
            .attr('y', 10)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'start')
            .text(this.data.y),
        );

    svg
      .append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(this.data)
      .join('rect')
      .attr('x', (d, i) => x(i))
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value))
      .attr('width', x.bandwidth());

    svg.append('g').call(xAxis);

    svg.append('g').call(yAxis);

    return svg;
  }

  renderLineChart = () => {
    this.data = this.arrayLineFormat()
    const margin = { top: 30, right: 40, bottom: 30, left: 40 };
    const height = 500;
    const width = 1000;
    const svg = d3
      .select('#mapContentChart')
      .append('svg')
      .attr('viewBox', [0, 0, width, height])
      .attr("id", this.state.countCharts);


    const x = d3.scaleUtc()
      .domain(d3.extent(this.data, d => d.date))
      .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top])

    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(this.data.y))

    const line = d3.line()
      .defined(d => !isNaN(d.value))
      .x(d => x(d.date))
      .y(d => y(d.value))

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    svg.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);

    return svg;
  }

  createChart() {
    if (this.state.docs[0].length < 2) {
      alert('Дождитесь загрузки данных и попробуйте снова')
    } else {
      if (this.state.countCharts !== 0) {
        const element = document.getElementById(this.state.countCharts-1);
        element.parentNode.removeChild(element);
      }
      this.setState({countCharts: this.state.countCharts+1})
      if (this.state.type === 'year') {
        this.setState({type: 'month'})
        this.renderBarChart()
      } else {
        this.setState({type: 'year'})
        this.renderLineChart()
      }
    }
  }

  render() {
    /*
    const client = new GShitsClient(
      ' https://sheets.googleapis.com/v4/spreadsheets/1HRQmWpdrt0kmF' +
        'vCv4Auk66QxSGJahh0_06wV5rTYRb8/values/Sheet1!A1:D5?' +
        'valueRenderOption=FORMULA&dateTimeRenderOption=SERIAL_NUMBER',
      googleData => {
        this.data = googleData;
        console.log('dataHandler', this.data.feed.entry);
      },
      error => {
        console.log('errorHandler', error);
      },
    );
     */
    /*
    client.getData().then(() => {
      for (let i = 0; this.data.feed.entry.length - 1; i++) {
        if (this.data.feed.entry[i]) {
          // console.log(this.counterArray);
          if (this.data.feed.entry[i].gs$cell.col === 1) {
            // this.counterArray.add({
            //  name: (
            //   this.data.feed.entry[i].content.$t[3] +
            //    this.data.feed.entry[i].content.$t[4]
            // ).parseInt(),
            // value: 0,
            // });
            if (
              (
                this.data.feed.entry[i].content.$t[3] +
                this.data.feed.entry[i].content.$t[4]
              ).parseInt() >=
              month + 1
            ) {
              if (month === 12) {
                month = 0;
              } else {
                month += 1;
              }
            } else {
              // this.counterArray[i].value += 1;
            }
          }
        }
      }
      // this.data = this.counterArray;
     */
    return (
      <div>
        <button onClick={this.createChart.bind(this)}>
          {this.state.type}
        </button>
        <div id="mapContentChart" />
      </div>
    );
  }
}

export default MonthGraph;
