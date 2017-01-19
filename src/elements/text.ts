import Element from '../element'
import Stage from '../stage'
import { Style } from '../style'

export default class Text extends Element {
  content: string

  constructor(text: string, style?: Style) {
    super(style)
    this.content = text
  }

  render(cxt: CanvasRenderingContext2D, stage: Stage) {
    const { dpr } = stage
    const { x, y, fontSize, fontFamily, fontItalic, textAlign, textBaseline, color } = this.style

    cxt.beginPath()

    cxt.font = `${fontItalic ? 'italic' : 'normal'} ${(fontSize || 12) * dpr}px ${fontFamily || 'sans-serif'}`
    if (color) cxt.fillStyle = color
    if (textAlign) cxt.textAlign = textAlign
    if (textBaseline) cxt.textBaseline = textBaseline

    cxt.fillText(this.content, dpr * x, dpr * y)
  }
}
