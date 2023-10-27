type UnknownArrayOrObject = unknown[] | Record<string, unknown>;


export const dirtyValues = (
  dirtyFields: any,
  allValues: any
): any => {

  if (dirtyFields === true || Array.isArray(dirtyFields)) {
    return allValues;
  }

  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [
      key,
      dirtyValues(dirtyFields[key], allValues[key])
    ])
  );
};