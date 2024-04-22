const flattenNestedArray = <T>(nestedArrays: T[][]): T[] => {
  //   const flat: T[] = [].concat(...array);
  const flattenedArray = ([] as T[]).concat(...nestedArrays);

  return flattenedArray;

  //   return flattenedArray.some(Array.isArray)
  //     ? flattenNestedArray(flattenedArray)
  //     : flattenedArray;
};

export default flattenNestedArray;
