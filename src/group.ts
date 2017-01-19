import Element from './element'
import Stage from './stage'
import { Style } from './style'
import * as typeis from './lib/typeof'
import { findRight, forEach, reduce } from './lib/util'
import { Point } from './lib/graph'
import {
  Transform,
  multiply,
  multiplyMT,
  multiplyTM,
  inverseApply,
  translate as translateMatrix,
  rotate as rotateMatrix,
  scale as scaleMatrix,
  zero as zeroMatrix,
} from './lib/matrix'

export default class Group extends Element {
  children: Element[]

  private childrenHasAnitaiom: boolean

  constructor()
  constructor(style: Style)
  constructor(children: Element[], style: Style)

  constructor(children?: Element[] | Style, style?: Style) {
    let gstyle: Style, gchildren: Element[]

    if (typeis.isArray(children)) {
      gchildren = [].concat(children)
      gstyle = style
    }
    else {
      gstyle = children
    }

    super(gstyle)

    gchildren = (gchildren || []).concat()
    gchildren.forEach(child => {child.parent = this})
    this.children = gchildren
  }

  addChild(child: Element) {
    child.parent = this
    this.children.push(child)
    this.stage.render()
  }

  removeChild(child: Element) {
    const index = this.children.indexOf(child)
    if (index > -1) {
      child.parent = null
      this.children.splice(index, 1)
    }
    this.stage.render()
  }

  render(cxt: CanvasRenderingContext2D, stage: Stage) {
    this.childrenHasAnitaiom = reduce(this.children, (prev, child, index) => {
      child.doRender()
      return prev || child.hasAnimation()
    }, false)
  }

  hasAnimation() {
    return this.childrenHasAnitaiom || super.hasAnimation()
  }

  getTarget(x: number, y: number): Element {
    const point = this.inversePoint(x, y)

    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[i]

      if (child instanceof Group) {
        const result = child.getTarget(point[0], point[1])
        if (result) {
          return result
        }
      }
      else {
        const p = child.inversePoint(point[0], point[1])
        if (child.inside(p[0], p[1])) {
          return child
        }
      }
    }
  }
}
