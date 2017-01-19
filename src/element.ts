import EventEmitter from './lib/eventemitter'
import { Animation, AnimationManager } from './animation'
import timingFunctions, { TimingFunction } from './timing-functions'
import Group from './group'
import Stage from './stage'
import { Style } from './style'
import * as typeis from './lib/typeof'
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
import { assign } from './lib/util'

export default class Element extends EventEmitter {
  style: Style
  parent: Group
  owner: Stage
  protected animationManager = new AnimationManager(this)
  protected _transform: Transform

  constructor(style?: Style) {
    super()
    this.style = assign({}, style)
  }

  get stage(): Stage {
    let element: Element = this

    while (element.parent) {
      element = element.parent
    }

    return element.owner
  }

  get transformOrigin() {
    return
  }

  get transform(): Transform {
    const {
      x, y, scale, rotate, translate, transformOrigin, transform
    } = this.style

    if ((!scale || scale === 1) && !rotate && !translate && !transform) {
      return null
    }

    let matrix = zeroMatrix()

    if (transformOrigin) {
      matrix = multiplyMT(matrix, transformOrigin[0], transformOrigin[1])
    }

    if (transform) {
      matrix = multiply(matrix, transform)
    }

    if (translate) {
      matrix = multiplyMT(matrix, translate[0], translate[1])
    }

    if (rotate) {
      matrix = multiply(matrix, rotateMatrix(rotate))
    }

    if (scale) {
      let scaleX, scaleY
      if (typeis.isNumber(scale)) {
        scaleX = scaleY = scale
      }
      else {
        [scaleX, scaleY] = scale
      }

      matrix = multiply(matrix, scaleMatrix(scaleX, scaleY))
    }

    if (transformOrigin) {
      matrix = multiplyMT(matrix, -transformOrigin[0], -transformOrigin[1])
    }

    return matrix
  }

  render(cxt: CanvasRenderingContext2D, stage: Stage) {}

  moveTo(x: number, y: number, duration: number, timingFunction?: TimingFunction) {
    this.animationManager.add({x, y}, duration, timingFunction)
  }

  setStyle(style: Style) {
    assign(this.style, style)
    this.stage && this.stage.render()
  }

  animate(style: Style, duration: number, timingFunction?: TimingFunction) {
    this.animationManager.add(style, duration, timingFunction)
    this.stage && this.stage.render()
  }

  beforeRender(cxt: CanvasRenderingContext2D, stage: Stage) {
    const { dpr } = stage
    const { opacity } = this.style

    this.animationManager.perform()
    cxt.save()

    const { transform } = this

    if (transform) {
      cxt.transform(
        transform[0],
        transform[1],
        transform[2],
        transform[3],
        transform[4] * dpr,
        transform[5] * dpr
      )
    }

    this._transform = transform

    if (opacity != null) {
      cxt.globalAlpha = cxt.globalAlpha * opacity
    }
  }

  afterRender(cxt: CanvasRenderingContext2D, stage: Stage) {
    cxt.restore()
  }

  doRender() {
    const { stage } = this
    const { context } = stage
    this.beforeRender(context, stage)
    this.render(context, stage)
    this.afterRender(context, stage)
  }

  hasAnimation() {
    return this.animationManager.list.length > 0
  }

  inversePoint(x: number, y: number) {
    return this._transform
      ? inverseApply(this._transform, [x, y])
      : [x, y]
  }

  inside(x: number, y: number): boolean {
    return false
  }
}
