const arrayToObject = (header, data) => {
  return data.reduce((acc, crt, index) => {
    if (!crt) {
      console.error(`Encountered undefined data row at index ${index}`);
      return acc;
    }
    const row = crt.map((value, index) => [header[index], value]);
    try {
      return [...acc, Object.fromEntries(row)];
    } catch (error) {
      console.error(`Error converting row to object at index ${index}`, row, error);
      return acc;
    }
  }, []);
};

module.exports = {
  arrayToObject,
};
