import React from 'react';
import style from './Statistic.module.scss';
import Async from '../basis/Async';
import { useTable } from '../../hooks';

const Statistic = () => {
  const state = useTable(['Regions!B1', "'Статьи УК'!D2", 'Наказание!G2', 'Regions!D1']);

  return (
    <Async {...state} className={style.container}>
      <StatisticContent value={state.value} />
    </Async>
  )
}

const StatisticContent = ({ value }) => {
  const totalViolations = value[0][0];
  const frequentArticle = value[1][0];
  const frequentPunishment = value[2][0];
  const casesPer100Thousand = value[3][0];

  return (
    <>
      <div className={style.statContainer}>
        <div className={style.totalViolations}>{totalViolations}</div>
        правонарушений
      </div>
      <div className={style.statContainer}>
        <div className={style.casesPer100Thousand}>{casesPer100Thousand}</div>
        дел на 100 тыс. населения
      </div>
      <div className={style.statContainer}>
        <div className={style.frequentArticle}>{frequentArticle}</div>
        популярная статья
      </div>
      <div className={style.statContainer}>
        <div className={style.frequentPunishment}>{frequentPunishment}</div>
        популярная мера наказания
      </div>
    </>
  )
}

export default Statistic;
