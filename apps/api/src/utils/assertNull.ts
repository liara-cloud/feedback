import { NullError } from "./NullError";

export function assertNull<T>(val: T, errorMessage: string): asserts val is NonNullable<T> {
  if (!val) {
    throw new NullError(errorMessage);
  }
}