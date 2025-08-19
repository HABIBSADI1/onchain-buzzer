// حداقل تعریف لازم تا TypeScript موقع بیلد غر نزند
declare module "canvas" {
  export function createCanvas(width: number, height: number): any;
}
