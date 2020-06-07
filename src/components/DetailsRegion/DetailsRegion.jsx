import React from 'react';
import { withRouter } from "react-router";
import CasesBySocial from './CasesBySocialDetailed';
import { getValuesFx, setNewsData } from '../../utils/effector';
import styles from './DetailsRegion.module.scss';

class DetailsRegion extends React.Component {
  state = {
    docs: ['Загрузка', 'Загрузка', 'Загрузка', 'Загрузка'],
    path: '/',
  };

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
      this.setState({
        docs: ['Загрузка', 'Загрузка', 'Загрузка', 'Загрузка'],
        path: this.props.location.pathname,
      });
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
        this.setState({ docsLenta: data });
        setNewsData(data);
      })
    }
  }

  render(){
    if (this.state.docsLenta !== undefined) {
      return (
        <div>
          <div>
            <div className={styles.dataBlock}>
              <h2 className={styles.region_name}>{this.state.docs[0]}</h2>
              <span>
              <span className={styles.caption}>население</span><br/>
              <span className={styles.number__green}>{this.state.docs[3]}</span>
            </span>
              <br/>
              <span>
              <span className={styles.caption}>правонарушений</span><br/>
              <span className={styles.number__red}>{this.state.docs[1]}</span>
            </span>
              <br/>
              <span>
              <span className={styles.caption}>правонарушений на 100 000 человек</span><br/>
              <span className={styles.number__yellow}>{this.state.docs[4]}</span>
            </span><br/>
            </div>
          </div>
          <div className={styles.caseBySocialBlock}>
            <CasesBySocial rawData={this.state.docsLenta}/>
          </div>
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
