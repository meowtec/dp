import { forEach } from './util'

export type Point = [number, number]

export interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

/**
 * 获取可容纳多边形的最小矩形
 */
export function pointsBounds(points: Point[]) {
  let minX: number, minY: number, maxX: number, maxY: number

  forEach(points, ([x, y], index) => {
    if (index === 0) {
      minX = maxX = x
      minY = maxY = y
    }
    else {
      if (x < minX) minX = x
      else if (x > maxX) maxX = x

      if (y < minY) minY = y
      else if (y > maxY) maxY = y
    }
  })

  return {
    minX,
    minY,
    maxX,
    maxY,
  }
}

export function pointInBounds([cx, cy]: Point, bounds: Bounds, borderWidth = 0) {
  return (cx > bounds.minX - borderWidth
    && cx < bounds.maxX + borderWidth
    && cy > bounds.minY - borderWidth
    && cy < bounds.maxY + borderWidth
  )
}

/**
 * 计算点是否在线上
 */
export function onLine(
  x: number, y: number, x1: number, y1: number, x2: number, y2: number, width: number
) {
  var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
  var dis = Math.abs(((x2 -x1) * (y2 - y) - (y2 - y1) * (x2 - x)) / length)

  if (dis > width / 2) return false

  return (
    Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y))
    + Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y)) - length
    < width
  )
}
