import BezierEasing from 'bezier-easing'

export type TimingFunction = (duration: number, currentStamp: number) => number

export default {
  linear(duration: number, currentStamp: number) {
    return currentStamp / duration
  },

  outSine(duration: number, currentStamp: number) {
    return (duration * 2 - currentStamp) * currentStamp / duration / duration
  },

  cubicBezier(startX: number, startY: number, endX: number, endY: number) {
    const easing = BezierEasing(startX, startY, endX, endY)

    return (duration: number, currentStamp: number) => {
      return easing(currentStamp / duration)
    }
  }
}
