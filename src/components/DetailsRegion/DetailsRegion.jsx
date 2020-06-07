import React from 'react';
import { withRouter } from "react-router";
import CasesBySocial from './CasesBySocialDetailed';
import { getValuesFx, setNewsData } from '../../utils/effector';

class DetailsRegion extends React.Component {
  constructor() {
    super();
    this.state = {}
    this.state.docs = ['Загрузка', 'Загрузка', 'Загрузка', 'Загрузка'];
    this.state.path = '/'
  }

  sortDocsLenta = (data) => {
    let sortedArray = []
    for (let i = 0; i < data.length; i++) {
      if (data[i][2] === this.state.docs[2]) {
        sortedArray.push(data[i])
      }
    }
    return sortedArray
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    getValuesFx({
      range: 'Stat!A1:E86',
      dateTimeRenderOption: 'SERIAL_NUMBER',
      majorDimension: 'ROWS'
    }).then(data => {
      let returnedData = [];
      for (let i = 0; i < data.length; i++) {
        if (id === data[i][2]) {
          returnedData = data[i];
        }
      }
      this.setState({ docs: returnedData });
    })
    getValuesFx({
      range: 'LENTA!A1:J1038',
      dateTimeRenderOption: 'SERIAL_NUMBER',
      majorDimension: 'ROWS'
    }).then(data => {
      data = this.sortDocsLenta(data)
      setNewsData(data);
      this.setState({ docsLenta: data });
    })
  }

  componentDidUpdate() {
    const {id} = this.props.match.params;
    if (this.props.location.pathname !== this.state.path) {
      this.state.path = this.props.location.pathname;
      this.state.docs = ['Загрузка', 'Загрузка', 'Загрузка', 'Загрузка'];
      getValuesFx({
        range: 'Stat!A1:E86',
        dateTimeRenderOption: 'SERIAL_NUMBER',
        majorDimension: 'ROWS'
      }).then(data => {
        let returnedData = [];
        for (let i = 0; i < data.length; i++) {
          if (id === data[i][2]) {
            returnedData = data[i];
          }
        }
        this.setState({ docs: returnedData });
      })
      getValuesFx({
        range: 'LENTA!A1:J1038',
        dateTimeRenderOption: 'SERIAL_NUMBER',
        majorDimension: 'ROWS'
      }).then(data => {
        data = this.sortDocsLenta(data)
        setNewsData(data);
      })
    }
  }

  render(){
    console.log(this.state)
    if (this.state.docs !== undefined) {
      return (
        <div>
          <li>{this.state.docs[0]}</li>
          <li>{this.state.docs[1]}</li>
          <li>{this.state.docs[3]}</li>
          <li>{this.state.docs[4]}</li>
          <CasesBySocial rawData={this.state.docs}/>
        </div>
      );
    } else {
      return(
        <h1>Загрузка...</h1>
      )
    }
  }
}

export default withRouter(DetailsRegion);
