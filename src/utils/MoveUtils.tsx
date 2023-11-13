import { type Coordinate } from './CoordinateUtils';
import { Player } from './BoardUtils';

export class Move {
  readonly player: Player;

  readonly src: Coordinate;

  readonly trg: Coordinate;

  constructor(player: Player, src: Coordinate, trg: Coordinate) {
    this.player = player;
    this.src = src;
    this.trg = trg;
  }

  isPromotable(): boolean {
    return this.player === Player.WHITE
      ? this.trg.row > 5
      : this.trg.row < 3;
  }

  public equals(move: Move): boolean {
    return this.player === move.player
      && this.src.equals(move.src)
      && this.trg.equals(move.trg);
  }
}
