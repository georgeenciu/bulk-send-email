const arrayToObject = (header, data) => {
  return data.reduce((acc, crt) => {
    const row = crt.map((value, index) => [header[index], value]);
    return [...acc, Object.fromEntries(row)];
  }, []);
};

module.exports = {
  arrayToObject,
};
