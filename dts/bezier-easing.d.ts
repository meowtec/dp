declare var BezierEasing: (
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => (x: number) => number

declare module "bezier-easing" {
  export default BezierEasing
}
