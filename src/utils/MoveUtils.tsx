import { type Coordinate } from './CoordinateUtils';

export const BLACK_DIRECTION_OFFSETS: number[] = [-10, 10, -1, 1, -11, -9, 9, 11, -21, -19];
export const WHITE_DIRECTION_OFFSETS: number[] = [10, -10, 1, -1, 9, 11, -9, -11, 21, 19];

export enum Direction {
  FRONT = 0,
  BACK = 1,
  LEFT = 2,
  RIGHT = 3,
  FRONT_LEFT = 4,
  FRONT_RIGHT = 5,
  BACK_LEFT = 6,
  BACK_RIGHT = 7,
  KNIGHTLEFT = 8,
  KNIGHTRIGHT = 9,
}

export class Move {
  readonly src: Coordinate;

  readonly trg: Coordinate;

  constructor(src: Coordinate, trg: Coordinate) {
    this.src = src;
    this.trg = trg;
  }

  public equals(move: Move): boolean {
    return this.src.equals(move.src) &&
      this.trg.equals(move.trg);
  }
}
