export class Coordinate {
  readonly row: number;

  readonly col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  getFenIdx(): number {
    return (10 * this.row) + this.col;
  }

  static fromFenIdx(idx: number): Coordinate {
    return new Coordinate(Math.floor(idx / 10), idx % 10);
  }

  public equals(coord: Coordinate): boolean {
    return this.row === coord.row &&
      this.col === coord.col;
  }
}
