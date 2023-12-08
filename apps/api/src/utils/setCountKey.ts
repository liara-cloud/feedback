export function setCountKey<T extends Record<string, any>, K extends string>(obj: T, key: K) {
  const { _count, ...rest } = obj;
  const result = {
    ...rest,
    [`${key}Count`]: _count[key]
  };
  return result as Omit<T, "_count"> & { [P in `${K}Count`]: number };
  // obj[`${key}Count`] = obj["_count"][key];
  // delete obj["_count"];
  // return obj as Omit<T, "_count"> & { [P in `${K}Count`]: number };
}