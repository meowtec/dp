import Element from '../element'
import Stage from '../stage'

const PI2 = Math.PI * 2

export default class Sector extends Element {
  render(cxt: CanvasRenderingContext2D, stage: Stage) {
    const {
      x,
      y,
      borderWidth,
      borderColor,
      backgroundColor,
      radius,
      angleStart,
      angleEnd,
      innerRadius,
    } = this.style

    const { dpr } = stage
    cxt.lineWidth = borderWidth * dpr
    cxt.strokeStyle = borderColor
    cxt.fillStyle = backgroundColor

    cxt.beginPath()
    cxt.arc(x * dpr, y * dpr, radius * dpr, angleStart, angleEnd)
    if (innerRadius) {
      // 内扇形
      cxt.arc(x * dpr, y * dpr, innerRadius * dpr, angleEnd, angleStart, true)
    }
    else {
      cxt.lineTo(x * dpr, y * dpr)
    }
    cxt.closePath()
    cxt.fill()
    borderWidth && cxt.stroke()
  }

  inside(cx: number, cy: number) {
    const { x, y, radius, innerRadius, angleStart, angleEnd } = this.style
    const quad = Math.pow(cx - x, 2) + Math.pow(cy - y, 2)

    if(!(radius * radius > quad
        && (innerRadius && innerRadius * innerRadius < quad ))) return false

    let angle = Math.atan2(cy - y, cx - x)
    if (angle < 0) angle = angle + PI2

    return angle > angleStart && angle < angleEnd
  }
}
