import React, { useState } from 'react';
import classnames from 'classnames';
import DiagramCasesPerYear from '../DiagramCasesPerYear';
import styles from './DiagramCasesSwticher.module.css';
import GraphCasesPerMonth from '../GraphCasesPerMonth';
import TextHeader from 'components/basis/TextHeader';

const DiagramCasesSwticher = () => {
  const [isPerYear, setIsPerYear] = useState(false); // TEST

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <TextHeader>Динамика дел</TextHeader>
        <button
          className={classnames(styles.button, {[styles.selected]: !isPerYear })}
          onClick={() => setIsPerYear(false)}
        >
          по месяцам
        </button>
        
        <button
          className={classnames(styles.button, {[styles.selected]: isPerYear })}
          onClick={() => setIsPerYear(true)}
        >
          по годам
        </button>
      </div>
      {
        isPerYear
        ? <DiagramCasesPerYear />
        : <GraphCasesPerMonth />
      }
    </div>
  )
}

export default DiagramCasesSwticher;
