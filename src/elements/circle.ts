import Element from '../element'
import Stage from '../stage'

const PI2 = Math.PI * 2

export default class Circle extends Element {
  render(cxt: CanvasRenderingContext2D, stage: Stage) {
    const { x, y, borderWidth, borderColor, backgroundColor, radius } = this.style
    const { dpr } = stage

    cxt.beginPath()
    cxt.lineWidth = borderWidth * dpr
    cxt.strokeStyle = borderColor
    cxt.fillStyle = backgroundColor

    cxt.arc(x * dpr, y * dpr, radius * dpr, 0, PI2)
    cxt.fill()
    borderWidth && cxt.stroke()
  }

  inside(cx: number, cy: number) {
    const { x, y, radius } = this.style
    return radius * radius > Math.pow(cx - x, 2) + Math.pow(cy - y, 2)
  }
}
