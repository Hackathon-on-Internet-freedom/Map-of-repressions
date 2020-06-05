import gsheetService from '../services/gsheetService';

/**
 * Запрашивает данные google таблицы с помощью api.
 * @param {object} params Объект с параметрами для запроса.
 * @param {string} params.ranges Строка запроса, например - 'Sheet8!H66:H70'.
 * @param {string} [params.fields] Необходимые поля в ответе, например - 'sheets'.
 */
export const getData = (params) => gsheetService(params);