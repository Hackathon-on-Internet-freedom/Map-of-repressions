import axios from 'axios';
import { SPREADSHEET_ID, API_KEY } from '../constants';
import _ from 'lodash';

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';

/**
 * Запрашивает данные google таблицы с помощью api.
 * @param {object} params Объект с параметрами для запроса.
 */
function gsheet(params) {
  let url = BASE_URL + SPREADSHEET_ID;

  if (params.customApiMethod) {
    url += params.customApiMethod;
    delete params.customApimethod;
  } else {

    if (_.isArray(params.ranges) && params.ranges.length > 1) {
      url += '/values:batchGet';
    } else {
      url += '/values/' + encodeURI(_.isArray(params.ranges) ? params.ranges[0] : params.ranges);
      delete params.ranges;
    }

  }

  params.key = API_KEY;

  const serializedParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (_.isArray(value)) {
      value.forEach((value) => serializedParams.append(key, value));
    } else {
      serializedParams.append(key, value);
    }
  });

  params = serializedParams;

  return axios.get(url, { params });
}

export default gsheet;