export function image(src: string) {
  const image = new Image()
  image.src = src
  return image
}
