import { Point } from './lib/graph'

export interface Style {
  [key: string]: any

  // element base
  x?: number
  y?: number
  opacity?: number
  transformOrigin?: [number, number]
  rotate?: number
  scale?: number | [number, number]
  translate?: [number, number]
  transform?: [number, number, number, number, number, number]
  pointerEvents?: boolean
  zIndex?: number

  // shape
  borderWidth?: number
  borderColor?: string
  backgroundColor?: string

  // rect
  width?: number
  height?: number

  // circle | sector
  radius?: number

  // sector
  innerRadius?: number
  angleStart?: number
  angleEnd?: number

  // line
  endX?: number
  endY?: number
  lineWidth?: number

  // text
  fontSize?: number
  fontFamily?: string
  fontItalic?: boolean
  textAlign?: 'start' | 'end' | 'left' | 'right' | 'center'
  textBaseline?: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom'
  color?: string

  // image
  clipX?: number
  clipY?: number
  clipWidth?: number
  clipHeight?: number

  // poly
  points?: Point[]
  closed?: boolean
}

export const defaultStyles: Style = {
  // element base
  opacity: 1,
  transformOrigin: [0, 0],
  rotate: 0,
  transform: [1, 0, 0, 1, 0, 0],
  scale: [1, 1],

  // shape
  borderWidth: 0,
  borderColor: '#000000',
  backgroundColor: '#000000',

  lineWidth: 1,

  // text
  fontSize: 12,
  color: '#000000',

  clipX: 0,
  clipY: 0,
}
