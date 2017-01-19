import Element from '../element'
import Stage from '../stage'
import { Style } from '../style'
import { forEach, find } from '../lib/util'
import { onLine, pointsBounds, pointInBounds, Bounds, Point } from '../lib/graph'

export default class Polygon extends Element {
  private bounds: {
    points: Point[]
    bounds: Bounds
  }

  /**
   * 获取容纳多边形的最小矩形：如果点不在矩形内，则肯定不在多边形内
   * 用于加速 inside 计算
   * 若 style.points 为 immutable，则在 points 变化后才重新计算 bounds
   *
   * @param{force} 不使用缓存数据
   */
  private getBounds(force = false) {
    const { points } = this.style
    if (force || !this.bounds || this.bounds.points !== points) {
      const bounds = pointsBounds(points)
      this.bounds = {
        points,
        bounds,
      }
    }

    return this.bounds.bounds
  }

  render(cxt: CanvasRenderingContext2D, stage: Stage) {
    const { points, borderWidth, borderColor, backgroundColor } = this.style
    const { dpr } = stage

    cxt.beginPath()
    cxt.lineWidth = borderWidth * dpr
    cxt.strokeStyle = borderColor

    forEach(points, (point, index) => {
      if (index === 0) {
        cxt.moveTo(point[0] * dpr, point[1] * dpr)
      }
      else {
        cxt.lineTo(point[0] * dpr, point[1] * dpr)
      }
    })

    // cxt.closePath()
    cxt.stroke()
  }

  inBounds(cx: number, cy: number) {
    return pointInBounds([cx, cy], this.getBounds(), this.style.borderWidth)
  }

  inside(cx: number, cy: number) {
    if (!this.inBounds(cx, cy)) return false

    const { points, closed, borderWidth = 0 } = this.style

    let fromPoint = closed ? points[points.length - 1] : null
    const result = find(points, point => {
      if (fromPoint && onLine(cx, cy, fromPoint[0], fromPoint[1], point[0], point[1], borderWidth)) {
        return true
      }
      fromPoint = point
    })
    return !!result
  }
}
