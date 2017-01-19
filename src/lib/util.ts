export function onFrame(func: Function) {
  let running = true
  function frame() {
    if (running) {
      func()
      requestAnimationFrame(frame)
    }
  }
  requestAnimationFrame(frame)

  return function remove() {
    running = false
  }
}

export function forEach<T>(
  array: T[],
  procedure: (item: T, index?: number) => void
): void {
  for (let i = 0; i < array.length; i++) {
    procedure(array[i], i)
  }
}

export function reduce<T, V>(
  array: T[],
  procedure: (prev: V, item: T, index?: number) => V,
  initial: V
): V {
  let value = initial

  for (let i = 0; i < array.length; i++) {
    value = procedure(value, array[i], i)
  }

  return value
}

export function find<T>(
  array: T[],
  procedure: (item: T, index?: number) => boolean
): [T, number] {
  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    if (procedure(item, i)) {
      return [item, i]
    }
  }
}

export function findRight<T>(
  array: T[],
  procedure: (item: T, index?: number) => boolean
): [T, number] {
  for (let i = array.length - 1; i >= 0; i--) {
    const item = array[i]
    if (procedure(item, i)) {
      return [item, i]
    }
  }
}

export function coop(min: number, max: number) {
  return (x: number) => x < min ? min : x > max ? max : x
}

export function simpleRandStr() {
  return Math.random().toString(36).slice(-8)
}

export function assign(target: any, source: any, ...more: any[]): any
export function assign(target: any) {
  for (let i = 1; i < arguments.length; i++) {
    let item = arguments[i]
    for (let key of Object.keys(item)) {
      target[key] = item[key]
    }
  }

  return target
}
