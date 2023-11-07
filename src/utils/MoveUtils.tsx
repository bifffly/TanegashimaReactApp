import { Coordinate } from "./CoordinateUtils";

export class Move {
  readonly src: Coordinate;
  readonly trg: Coordinate;

  constructor(src: Coordinate, trg: Coordinate) {
    this.src = src;
    this.trg = trg;
  }

  public equals(move: Move) {
    return this.src.equals(move.src)
      && this.trg.equals(move.trg);
  }
}
