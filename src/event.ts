import Element from './element'
import { assign } from './lib/util'

export interface EventDescriptor {
  bubbleable?: boolean
  screenX?: number
  screenY?: number
  clientX?: number
  clientY?: number
}

export default class Event {
  type: string
  target: Element
  bubbleable: boolean
  screenX: number
  screenY: number
  clientX: number
  clientY: number

  private stopped = false

  constructor(type: string, descriptor: EventDescriptor = {}) {
    this.type = type
    assign(this, descriptor)
  }

  stopPropagation() {
    this.stopped = true
  }

  dispatch(element: Element) {
    this.target = element

    if (this.bubbleable) {
      while (element && !this.stopped) {
        element.emit(this.type, this)
        element = element.parent
      }
    }
    else {
      element.emit(this.type, this)
    }
  }
}

export function dispatchEvent(type: string, element: Element, e: MouseEvent) {
  const bubbleable = !(type === 'mouseenter' || type === 'mouseleave')

  new Event(type, {
    bubbleable,
    clientX: e.offsetX,
    clientY: e.offsetY,
    screenX: e.screenX,
    screenY: e.screenY,
  }).dispatch(element)
}
