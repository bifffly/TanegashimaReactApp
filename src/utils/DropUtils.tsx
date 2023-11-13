import { type Piece } from './PieceUtils';
import { type Coordinate } from './CoordinateUtils';

export class Drop {
  readonly piece: Piece;

  readonly trg: Coordinate;

  constructor(piece: Piece, trg: Coordinate) {
    this.piece = piece;
    this.trg = trg;
  }

  public equals(drop: Drop): boolean {
    return this.piece === drop.piece
      && this.trg === drop.trg;
  }
}
