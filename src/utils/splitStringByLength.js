import _ from 'lodash';

const splitStringByLength = (str, maxLength) => {
  if (!str || !maxLength) throw new Error('str и maxLength обязательны');
  
  const collocations = [''];
  const words = str.split(' ');

  words.forEach((w) => {
    if (_.last(collocations).length > maxLength) {
      collocations.push(w);
    }else {
      collocations[collocations.length - 1] += ' ' + w;
    }
  })
  return collocations;
}

export default splitStringByLength;