import Element from '../element'
import Stage from '../stage'
import { Style } from '../style'
import { forEach, reduce } from '../lib/util'
import { pointsBounds, pointInBounds, Bounds, Point } from '../lib/graph'

export default class Polygon extends Element {
  private bounds: {
    points: Point[]
    bounds: Bounds
  }

  /**
   * 获取容纳多边形的最小矩形：如果点不在矩形内，则肯定不在多边形内
   * 用于加速 inside 计算
   * 若 style.points 为 immutable，则在 points 变化后才重新计算 bounds
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
    cxt.fillStyle = backgroundColor

    forEach(points, ([x, y], index) => {
      if (index === 0) {
        cxt.moveTo(x * dpr, y * dpr)
      }
      else {
        cxt.lineTo(x * dpr, y * dpr)
      }
    })

    cxt.closePath()

    cxt.fill()
    borderWidth && cxt.stroke()
  }

  pointInBounds(cx: number, cy: number) {
    return pointInBounds([cx, cy], this.getBounds(), this.style.borderWidth)
  }

  /**
   * 计算点是否在多边形内，算法：
   *   1. 如果点不在 bounds 区域内，则不在多边形内
   *   2. 从点开始沿着 x 轴（+Infinite, 0) 方向画直线，
   *      如果直线和多边形的边有奇数个交点，则在区域内
   */
  inside(cx: number, cy: number) {
    if (!this.pointInBounds(cx, cy)) return false

    const points = this.style.points
    let fromPoint = points[points.length - 1]
    const cross = reduce(points, (cross, point) => {
      const [x, y] = point
      const [fromPointX, fromPointY] = fromPoint
      if (
         ((fromPointY >= cy && y < cy) || (fromPointY < cy && y >= cy))
         && ((fromPointX - x) / (fromPointY - y) * (cy - y) + x) > cx
      ) {
        cross++
      }
      fromPoint = point
      return cross
    }, 0)

    return cross % 2 === 1
  }
}
