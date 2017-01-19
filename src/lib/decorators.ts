export function autobind(target: Object, key: string, descriptor: PropertyDescriptor) {
  return {
    get() {
      const fun = bind(descriptor.value, this)
      Object.defineProperty(this, key, {
        value: fun
      })
      return fun
    }
  }
}

// fast bind (limited feature) for @autobind
function bind(func: Function, thisArg: any) {
  return function(arg1?: any, arg2?: any, arg3?: any) {
    switch (arguments.length) {
      case 0:
        return func.call(thisArg)
      case 1:
        return func.call(thisArg, arg1)
      case 2:
        return func.call(thisArg, arg1, arg2)
      case 3:
        return func.call(thisArg, arg1, arg2, arg3)
    }

    return func.apply(thisArg, arguments)
  }
}
