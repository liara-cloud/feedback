export function exclude<Obj, Key extends keyof Obj>(obj: Obj, keys: Key[]): Omit<Obj, Key> {
  // @ts-ignore
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );
}