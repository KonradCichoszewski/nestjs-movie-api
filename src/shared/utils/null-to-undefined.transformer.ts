// If null transform to undefined, leave other values unchanged
export const nullToUndefined = ({ value }) => {
  return value === null ? undefined : value;
};
