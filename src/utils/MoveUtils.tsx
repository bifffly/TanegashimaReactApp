import { type Coordinate } from './CoordinateUtils';
import { Player } from './BoardUtils';

/**
 * Class representing a move.
 */
export class Move {
  readonly player: Player;

  readonly src: Coordinate;

  readonly trg: Coordinate;

  /**
   * Constructs a move object.
   *
   * @param player player making the move
   * @param src source (start) coordinate of the move
   * @param trg target (end) coordinate of the move
   */
  constructor(player: Player, src: Coordinate, trg: Coordinate) {
    this.player = player;
    this.src = src;
    this.trg = trg;
  }

  /**
   * Checks whether this move would make the piece being moved eligible for promotion.
   */
  isPromotable(): boolean {
    return this.player === Player.GOTE
      ? this.trg.row > 5
      : this.trg.row < 3;
  }

  /**
   * Checks for equality with the given Move object.
   *
   * @param move Move object to be checked for equality.
   */
  public equals(move: Move): boolean {
    return this.player === move.player
      && this.src.equals(move.src)
      && this.trg.equals(move.trg);
  }
}
