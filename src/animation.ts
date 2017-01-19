import timingFunctions, { TimingFunction } from './timing-functions'
import Element from './element'
import { ColorTuple, parseColor, stringifyColor } from './lib/color'
import { Style, defaultStyles } from './style'
import * as typeis from './lib/typeof'
import { find } from './lib/util'
import TMath from './lib/math'

export enum AnimationValueType {
  Number,
  Array,
  Broken,
}

export type AnimationValue = number | number[]

export interface Animation {
  [key: string]: any
  name: string
  from: AnimationValue
  to: AnimationValue
  delta: number | number[]
  duration: number
  startDate: number
  valueType: AnimationValueType
  timingFunction?: TimingFunction
}

function isColorName(name: string) {
  return name === 'borderColor'
      || name === 'backgroundColor'
      || name === 'color'
}

function normalizeScale(scale: number | number[]) {
  return typeis.isNumber(scale) ? [scale, scale] : scale
}

function performAnimation(animation: Animation) {
  const currentStamp = Date.now() - animation.startDate
  const outdated = currentStamp > animation.duration

  const { name } = animation

  let value: any

  if (outdated) {
    value = animation.to
  }
  else {
    const { from, duration, delta, valueType, timingFunction = timingFunctions.linear } = animation
    const ratio = timingFunction(duration, currentStamp)

    if (valueType === AnimationValueType.Number) {
      value = ratio * <number>delta + <number>from
    }
    else if (valueType === AnimationValueType.Array) {
      value = TMath.add(<number[]>from, TMath.multiply(<number[]>delta, ratio))
    }
    else {
      value = from
    }
  }

  if (isColorName(name)) {
    value = stringifyColor(<ColorTuple>value)
  }

  return {
    next: !outdated,
    value,
  }
}

export class AnimationManager {
  element: Element
  list: Array<Animation> = []

  constructor(element: Element) {
    this.element = element
  }

  get(propertyName: string) {
    return find(this.list, item => item.name === propertyName)
  }

  addItem(name: string, from: any, to: any, duration: number, timingFunction: TimingFunction) {

    this.removeByName(name)

    let valueType: AnimationValueType

    if (from == null) {
      from = <AnimationValue>defaultStyles[name]
    }

    if (name === 'scale') {
      from = normalizeScale(from)
      to = normalizeScale(to)
    }
    else if (isColorName(name)) {
      from = parseColor(from)
      to = parseColor(to)
    }

    let delta: number | number[]

    if (typeis.isNumber(from) && typeis.isNumber(to)) {
      delta = to - from
      valueType = AnimationValueType.Number
    }
    else if (typeis.isArray(from) && typeis.isArray(to)) {
      delta = TMath.subtract(<number[]>to, <number[]>from)
      valueType = AnimationValueType.Array
    }
    else {
      valueType = AnimationValueType.Broken
    }

    this.list.push({
      name,
      from,
      to,
      delta,
      duration,
      startDate: Date.now(),
      valueType,
      timingFunction,
    })
  }

  add(style: Style, duration = 0, timingFunction: TimingFunction) {
    const { element } = this

    for (let name in style) {
      if (style.hasOwnProperty(name)) {
        this.addItem(name, element.style[name], style[name], duration, timingFunction)
      }
    }
  }

  removeByName(name: string) {
    const result = this.get(name)
    if (result) {
      this.remove(result[1])
    }
  }

  remove(index: number) {
    this.list.splice(index, 1)
  }

  perform() {
    const { element, list } = this
    const { style } = element
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const { next, value } = performAnimation(item)
      style[item.name] = value
      if (!next) {
        this.remove(i)
        i--
      }
    }
  }
}
