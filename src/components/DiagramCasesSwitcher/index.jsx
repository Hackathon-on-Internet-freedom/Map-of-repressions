import React, { useState } from 'react';
import DiagramCasesPerYear from '../DiagramCasesPerYear';
import style from './DiagramCasesSwticher.module.scss';
import GraphCasesPerMonth from '../GraphCasesPerMonth';

const DiagramCasesSwticher = () => {
  const [isPerYear, setIsPerYear] = useState(true);

  return (
    <div className={style.container}>
      <div className={style.header}>Динамика дел</div>
      <button onClick={() => setIsPerYear(true)}>по годам</button>
      <button onClick={() => setIsPerYear(false)}>по месяцам</button>
      {
        isPerYear
        ? <DiagramCasesPerYear />
        : <GraphCasesPerMonth />
      }
    </div>
  )
}

export default DiagramCasesSwticher;