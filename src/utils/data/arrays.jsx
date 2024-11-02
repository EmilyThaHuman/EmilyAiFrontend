export const deduplicateArray = array => {
  return Array.from(new Set(array));
};

export const deduplicateArrayByKey = (array, key) => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};
