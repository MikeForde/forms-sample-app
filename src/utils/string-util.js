export const convertStringToNumber = (stringToConvert, defaultValue) => {
  const value = parseInt(stringToConvert, 10);

  return Number.isNaN(value) ? defaultValue : value;
};

export const checkStringOrStringArrayConstainsSubstring = (
  toCheck,
  substring,
  ignoreCase = true,
) => {
  if (Array.isArray(toCheck)) {
    return toCheck.some(
      (arrayEntry) => checkStringOrStringArrayConstainsSubstring(arrayEntry, substring, ignoreCase),
    );
  }
  return ignoreCase
    ? toCheck.toLowerCase().includes(substring.toLowerCase())
    : toCheck.includes(substring);
};
