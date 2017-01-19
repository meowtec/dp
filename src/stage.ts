import { onFrame } from './lib/util'
import { autobind } from './lib/decorators'
import Element from './element'
import { dispatchEvent } from './event'
import Group from './group'

export interface StageOptions {
  element: HTMLCanvasElement
  highDPI?: boolean
}

export default class Stage {
  private clearAnimation: Function
  private options: StageOptions
  private deviceWidth: number
  private deviceHeight: number
  private willPaintNextFrame: boolean
  private mouseElement: Element
  private root: Group

  public dpr: number
  public context: CanvasRenderingContext2D
  public element: HTMLCanvasElement

  constructor(options: StageOptions) {
    this.options = options
    Object.defineProperty(this, 'element', {
      value: options.element
    })

    this.updateSize()
    this.createContext()
    this.bindEvents()
  }

  private updateSize() {
    const { element } = this
    const { clientWidth, clientHeight } = element
    const dpr = window.devicePixelRatio
    this.deviceWidth = element.width = clientWidth * dpr
    this.deviceHeight = element.height = clientHeight * dpr
    this.dpr = dpr
  }

  private createContext() {
    const context = this.element.getContext('2d')
    this.context = context
    this.root = new Group()
    this.root.owner = this
  }

  private bindEvents() {
    const { element } = this
    element.addEventListener('click', this.onclick)
    element.addEventListener('mousemove', this.onmousemove)
    element.addEventListener('mousedown', this.onmousedown)
    element.addEventListener('mouseup', this.onmouseup)
  }

  private unbindEvents() {
    const { element } = this
    element.removeEventListener('click', this.onclick)
    element.removeEventListener('mousemove', this.onmousemove)
    element.removeEventListener('mousedown', this.onmousedown)
    element.removeEventListener('mouseup', this.onmouseup)
  }

  private eventTarget(e: MouseEvent) {
    return this.root.getTarget(e.offsetX, e.offsetY)
  }

  @autobind
  private onmousemove(e: MouseEvent) {
    const { mouseElement } = this
    const element = this.eventTarget(e)
    this.mouseElement = element

    if (mouseElement !== element) {
      if (mouseElement) {
        dispatchEvent('mouseleave', mouseElement, e)
      }

      if (element) {
        dispatchEvent('mouseenter', element, e)
      }
    }
  }

  @autobind
  private onclick(e: MouseEvent) {
    const element = this.eventTarget(e)

    if (element) {
      dispatchEvent('click', element, e)
    }
  }

  @autobind
  onmousedown(e: MouseEvent) {
    const element = this.eventTarget(e)
    if (element) {
      dispatchEvent('mousedown', element, e)
    }
  }

  @autobind
  onmouseup(e: MouseEvent) {
    const element = this.eventTarget(e)
    if (element) {
      dispatchEvent('mouseup', element, e)
    }
  }

  addChild(child: Element) {
    this.root.addChild(child)
  }

  removeChild(child: Element) {
    this.root.removeChild(child)
  }

  private startLoopRender() {
    this.clearAnimation = onFrame(() => {
      this.paint()
    })
  }

  private stopLoopRender() {
    if (!this.clearAnimation) return
    this.clearAnimation()
    this.clearAnimation = null
  }

  private paint() {
    this.context.clearRect(0, 0, this.deviceWidth, this.deviceHeight)

    this.root.doRender()

    const hasAnimation = this.root.hasAnimation()

    if (hasAnimation && !this.clearAnimation) {
      this.startLoopRender()
    }
    else if (!hasAnimation && this.clearAnimation) {
      this.stopLoopRender()
    }
  }

  render() {
    if (this.clearAnimation || this.willPaintNextFrame) {
      return
    }

    this.willPaintNextFrame = true
    requestAnimationFrame(() => {
      this.willPaintNextFrame = false
      this.paint()
    })
  }

  destroy() {
    this.root = null

    this.context.clearRect(0, 0, this.deviceWidth, this.deviceHeight)
    this.stopLoopRender()
    this.unbindEvents()
  }
}
