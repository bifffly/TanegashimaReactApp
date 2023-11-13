/**
 * Class representing a coordinate square on the board.
 */
export class Coordinate {
  readonly row: number;

  readonly col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  /**
   * Returns the index within the FEN representation of the board this coordinate will occur at.
   */
  getFenIdx(): number {
    return (10 * this.row) + this.col;
  }

  /**
   * Given a FEN string index, returns a Coordinate object.
   *
   * @param idx FEN string index
   */
  static fromFenIdx(idx: number): Coordinate {
    return new Coordinate(Math.floor(idx / 10), idx % 10);
  }

  /**
   * Checks for equality with the given Coordinate object.
   *
   * @param coord Coordinate object to be checked for equality.
   */
  public equals(coord: Coordinate): boolean {
    return this.row === coord.row
      && this.col === coord.col;
  }
}
