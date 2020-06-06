import React from 'react';
import style from './Statistic.scss';
import { useTable } from '../../hooks';

const Statistic = () => {
  const state = useTable(['Regions!B1', "'Статьи УК'!D2", 'Наказание!G2']);

  return (
    <div>
      {
        state.loading
        ? <div>Загрузка...</div>
        : state.error
          ? <div>Ошибка: {state.error.message}</div>
          : <StatisticContent
              totalViolations={state.value[0][0]}
              frequentArticle={state.value[1][0]}
              frequentPunishment={state.value[2][0]}
            />
      }
    </div>
  );
}

const StatisticContent = ({ totalViolations, frequentArticle, frequentPunishment }) => (
  <div className={style.container}>
    <div className={style.header}>
      Общее число правонарушений:
      <div className={style.value}>{totalViolations}</div>
    </div>
    <div className={style.header}>
      Самая частая статья:
      <div className={style.value}>{frequentArticle}</div>
    </div>
    <div className={style.header}>
      Популярная мера наказания:
      <div className={style.value}>{frequentPunishment}</div>
    </div>
  </div>
);

export default Statistic;