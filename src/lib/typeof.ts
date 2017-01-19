export function isNumber(number: any): number is number {
  return typeof number === 'number'
}

export function isString(string: any): string is string {
  return typeof string === 'string'
}

export function isBoolean(boolean: any): boolean is boolean {
  return typeof boolean === 'boolean'
}

export function isFunction(func: any): func is Function {
  return typeof func === 'function'
}

const toString = Object.prototype.toString

export function isArray<T>(array: any): array is Array<T> {
  return toString.call(array) === '[object Array]'
}
