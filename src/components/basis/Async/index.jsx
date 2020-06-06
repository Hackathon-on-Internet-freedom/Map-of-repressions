import React from 'react';
import style from './Async.scss';

const Async = ({ loading, error, className, children }) => {
  const resolvedClassName = [className, style.async].join(' ');
  let key = loading || error ? 'loadingOrError' : 'asyncContainer';

  return (
    <div key={key} className={resolvedClassName}>
      {
        loading
        ? <div className={style.center}>Загрузка...</div>
        : error
          ? 'Ошибка: ' + error.message || '???'
          : children
      }
    </div>
  )
}

Async.defaultProps = {
  className: ''
};

export default Async;