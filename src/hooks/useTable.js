import { useAsync } from 'react-use';
import api from '../api';

/**
 * Хук для выборки данных из таблицы.
 * @param {(string|string[])} params.ranges Строка запроса, например - 'Sheet8!H66:H70'.
 * Если массив то будет выполнена множественная выборка за один запрос.
 * @param {array} [args=[]] Массив с параметрами для хука.
 * @returns {object} state.loading - boolean состояния запроса
 * state.error - объект с ошибкой
 * state.value - массив с данными
 */
const useTable = (ranges, args = []) => useAsync(async () => {
  const response = await api.gsheet.getData({ ranges });
  if (response.data.valueRanges) return simplifyValueRanges(response.data.valueRanges);
  return response.data.values;
}, args);

export default useTable;

const simplifyValueRanges = (valueRanges) => valueRanges.map((data) => data.values);