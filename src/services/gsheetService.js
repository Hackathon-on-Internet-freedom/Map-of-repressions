import axios from 'axios';
import { SPREADSHEET_ID, API_KEY } from '../constants';

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';

/**
 * Запрашивает данные google таблицы с помощью api.
 * @param {object} params Объект с параметрами для запроса.
 */
function gsheet(params) {
  const config = {
    params: {
      key: API_KEY,
      ...params
    }
  };

  return axios.get(BASE_URL + SPREADSHEET_ID, config);
}

export default gsheet;