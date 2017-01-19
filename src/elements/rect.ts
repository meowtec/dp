import Element from '../element'
import Stage from '../stage'

export default class Rect extends Element {
  render(cxt: CanvasRenderingContext2D, stage: Stage) {
    const { x, y, width, height, borderWidth, borderColor, backgroundColor } = this.style
    const { dpr } = stage

    cxt.beginPath()
    cxt.lineWidth = borderWidth * dpr
    cxt.strokeStyle = borderColor
    cxt.fillStyle = backgroundColor

    cxt.rect(
      x * dpr,
      y * dpr,
      width * dpr,
      height * dpr
    )
    cxt.fill()
    borderWidth && cxt.stroke()
  }

  inside(cx: number, cy: number) {
    const { x, y, width, height } = this.style
    return cx > x && cy > y && cx < x + width && cy < y + height
  }
}
