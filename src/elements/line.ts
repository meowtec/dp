import Element from '../element'
import Stage from '../stage'

export default class Line extends Element {
  render(cxt: CanvasRenderingContext2D, stage: Stage) {
    const { x, y, endX, endY, lineWidth = 1, backgroundColor } = this.style
    const { dpr } = stage

    cxt.beginPath()
    cxt.lineWidth = lineWidth * dpr
    cxt.strokeStyle = backgroundColor

    cxt.moveTo(x * dpr, y * dpr)
    cxt.lineTo(endX * dpr, endY * dpr)
    cxt.stroke()
  }
}
