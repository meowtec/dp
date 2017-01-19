import { Point } from './graph'
export type Transform = [number, number, number, number, number, number]

/**
 * product two transform2d matrix
 *
 * @param x first matrix
 * @param y second matrix
 */
export const multiply = (x: Transform, y: Transform): Transform => [
  x[0] * y[0] + x[2] * y[1],
  x[1] * y[0] + x[3] * y[1],
  x[0] * y[2] + x[2] * y[3],
  x[1] * y[2] + x[3] * y[3],
  x[0] * y[4] + x[2] * y[5] + x[4],
  x[1] * y[4] + x[3] * y[5] + x[5],
]


/**
 * product matrix AB in which B is a translate matrix
 *
 * `multiplyMT([a, b, c, d, e, f], x, y)`
 * is equal to:
 * `multiply([a, b, c, d, e, f], [1, 0, 0, 1, x, y])`
 *
 * @param m matrix
 * @param x dx
 * @param y dy
 */
export const multiplyMT = (m: Transform, x: number, y: number): Transform => [
  m[0],
  m[1],
  m[2],
  m[3],
  m[0] * x + m[2] * y + m[4],
  m[1] * x + m[3] * y + m[5],
]

/**
 * product AB in which A is a translate matrix
 *
 * `multiplyMT([a, b, c, d, e, f], x, y)`
 * is equal to:
 * `multiply([1, 0, 0, 1, x, y], [a, b, c, d, e, f])`
 *
 * @param m matrix
 * @param x dx
 * @param y dy
 */
export const multiplyTM = (m: Transform, x: number, y: number): Transform => [
  m[0],
  m[1],
  m[2],
  m[3],
  m[4] + x,
  m[5] + y,
]

/**
 * transform a point to another point using a transform matrix
 *
 * @param transform transform matrix
 * @param point point[x, y]
 */
export const transformApply = (transform: Transform, point: Point): Point => [
  point[0] * transform[0] + point[1] * transform[2] + transform[4],
  point[0] * transform[1] + point[1] * transform[3] + transform[5],
]

/**
 * get the inverse matrix of a transform
 */
export const inverse = (m: Transform): Transform => {
  const adbc = m[0] * m[3] - m[1] * m[2]
  return [
    m[3] / adbc,
    -m[1] / adbc,
    -m[2] / adbc,
    m[0] / adbc,
    (m[2] * m[5] - m[3] * m[4]) / adbc,
    (m[1] * m[4] - m[0] * m[5]) / adbc,
  ]
}

/**
 * give a transformed point and the matrix
 * return the original point
 */
export const inverseApply = (m: Transform, point: Point): Point => {
  const adbc = m[0] * m[3] - m[1] * m[2]
  return [
    (m[3] * point[0] - m[2] * point[1] + m[2] * m[5] - m[3] * m[4]) / adbc,
    (-m[1] * point[0] + m[0] * point[1] + m[1] * m[4] - m[0] * m[5]) / adbc,
  ]
}

export const rotate = (angle: number): Transform => {
  const cosx = Math.cos(angle)
  const sinx = Math.sin(angle)
  return [cosx, sinx, -sinx, cosx, 0, 0]
}

export const translate = (x: number, y: number): Transform => [1, 0, 0, 1, x, y]

export const scale = (x: number, y: number): Transform => [x, 0, 0, y, 0, 0]

export const zero = (): Transform => [1, 0, 0, 1, 0, 0]
