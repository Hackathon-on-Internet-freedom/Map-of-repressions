import gsheetService from '../services/gsheetService';

/**
 * Запрашивает данные google таблицы с помощью api.
 * @param {object} params Объект с параметрами для запроса.
 * @param {(string|string[])} params.ranges Строка запроса, например - 'Sheet8!H66:H70'.
 * Если массив то будет выполнена множественная выборка за один запрос.
 */
export const getData = (params) => gsheetService(params);