const limitStringLength = (str, maxLength) => {
  return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
}
export default limitStringLength;