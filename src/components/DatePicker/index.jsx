import React, { useCallback } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';

import ru from 'date-fns/locale/ru';
import './react-datepicker.module.scss';
import './datepicker.module.scss';
import styleButton from './styleButton.module.scss';

import { createEvent, createStore } from 'effector';
import { useStore } from 'effector-react'

registerLocale('ru', ru)

const startDateChange = createEvent('start-date-change');
const endDateChange = createEvent('end-date-change');

export const startDate = createStore(new Date(2015, 1, 1))
  .on(startDateChange, (prevState, payload) => {
    return payload;
  });

export const endDate = createStore(new Date())
  .on(endDateChange, (prevState, payload) => {
    return payload;
  });

// class DatePicker extends React.Component {
const DatePicker = () => {
  const start = useStore(startDate);
  const end = useStore(endDate);

  const onClick = useCallback(
    () => {
      startDateChange(new Date(2015, 0, 1));
      endDateChange(new Date());
    },
    [],
  );

  return (
    <div>
      <ReactDatePicker
        dateFormat="dd.MM.yyyy"
        selected={start}
        onChange={startDateChange}
        locale="ru"
      />

      <ReactDatePicker
        dateFormat="dd.MM.yyyy"
        selected={end}
        onChange={endDateChange}
        locale="ru"
      />
      <div className={styleButton.reset} onClick={onClick}>
        Сбросить
      </div>
    </div>
  );
}

export default DatePicker;
