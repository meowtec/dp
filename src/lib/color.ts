import { coop } from './util'
import * as typeis from './typeof'

export type ColorTuple = [number, number, number, number]

function InvalidColorError(color: string) {
  return new Error(`'${color}' is not a valid color.`)
}

const ffcoop = coop(0, 0xff)

function parseHexColor(hexColor: string) {
  const intColor = parseInt(hexColor.replace('#', ''), 16)

  if (isNaN(intColor)) {
    throw InvalidColorError(hexColor)
  }

  return parseIntColor(intColor, hexColor.length === 4 ? true : false)
}

function parseIntColor(intColor: number, short: boolean): ColorTuple {
  if (short) {
    return [
      (intColor >> 8) * 17,
      (intColor >> 4 & 0xf) * 17,
      (intColor & 0xf) * 17,
      0xff
    ]
  }
  else {
    return [
      intColor >> 16,
      intColor >> 8 & 0xff,
      intColor & 0xff,
      0xff
    ]
  }
}

function parseRGBColor(rgbColor: string): ColorTuple {
  const regexp = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/

  const matched = rgbColor.match(regexp)
  if (!matched) {
    throw InvalidColorError(rgbColor)
  }

  const alpha = matched[4]
    ? ~~ffcoop(parseFloat(matched[4]) * 0xff)
    : 0xff

  return [
    ffcoop(~~matched[1]),
    ffcoop(~~matched[2]),
    ffcoop(~~matched[3]),
    alpha
  ]
}

export function parseColor(color: string): ColorTuple {
  if (typeis.isString(color)) {
    if (color.indexOf('#') === 0) {
      return parseHexColor(color)
    }

    if (color.indexOf('rgb') === 0) {
      return parseRGBColor(color)
    }
  }

  throw InvalidColorError(color)
}

export function stringifyColor(color: ColorTuple) {
  return `rgba(${~~color[0]}, ${~~color[1]}, ${~~color[2]}, ${color[3] / 0xff})`
}
