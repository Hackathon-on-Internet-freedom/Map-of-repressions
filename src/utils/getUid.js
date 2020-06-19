/**
 * Генерирует простой uid из 9 символов.
 * @param {string} prefix Префикс для id.
 * @return {string} uid.
 */
const getUid = (prefix) => {
  prefix = prefix + '_' || '';
  return prefix + Math.random().toString(36).substr(2, 9);
}

export default getUid;