export type TupleNumber = number[]

export default {
  add(x: TupleNumber, y: TupleNumber): TupleNumber {
    return x.map((item, i) => item + y[i])
  },

  subtract(x: TupleNumber, y: TupleNumber): TupleNumber {
    return x.map((item, i) => item - y[i])
  },

  multiply(x: TupleNumber, y: number): TupleNumber {
    return x.map(item => item * y)
  },

  divide(x: TupleNumber, y: number): TupleNumber {
    return x.map(item => item / y)
  },
}
