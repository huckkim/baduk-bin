export enum Color {
  BLACK,
  WHITE
};

export type Board = Array<Array<null | Color>>;

export class Coord {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
