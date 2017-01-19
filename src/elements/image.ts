import Element from '../element'
import Stage from '../stage'
import { Style } from '../style'
import { image } from '../lib/image'

export default class Image extends Element {
  image: HTMLImageElement

  constructor(src: string, style: Style) {
    super(style)
    this.image = image(src)
    this.image.onload = () => {
      this.stage && this.stage.render()
    }
  }

  render(cxt: CanvasRenderingContext2D, stage: Stage) {
    const { image } = this
    if (!image.complete) return

    const { style } = this
    const { dpr } = stage
    let {
      width = image.width,
      height = image.height,
      clipX = 0,
      clipY = 0,
      clipWidth,
      clipHeight,
    } = this.style
    clipWidth = clipWidth || width - clipX
    clipHeight = clipHeight || height - clipY

    cxt.drawImage(
      image,
      clipX * dpr,
      clipY * dpr,
      clipWidth * dpr,
      clipHeight * dpr,
      style.x * dpr,
      style.y * dpr,
      width * dpr,
      height * dpr
    )
  }
}
