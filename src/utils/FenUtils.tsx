import { Coordinate } from './CoordinateUtils';
import {
  Piece,
  type PieceString,
} from './PieceUtils';
import { BLACK_DIRECTION_OFFSETS, Direction, Move, WHITE_DIRECTION_OFFSETS } from './MoveUtils';

export const START_FEN_STRING: string = 'LKSGOGSKL/1R5B1/PPPPPPPPP/9/9/9/ppppppppp/1b5r1/lksgogskl b - - 0';

export type Player = 'w' | 'b';

export class FenState {
  board: string;

  turn: Player;

  whiteCaptures: string;

  blackCaptures: string;

  turnNumber: number;

  constructor(fenString: string) {
    const args: string[] = fenString.split(' ');

    this.board = args[0];
    this.turn = args[1] as Player;
    this.whiteCaptures = args[2];
    this.blackCaptures = args[3];
    this.turnNumber = parseInt(args[4]);
  }

  getPieceAt(coord: Coordinate): Piece | undefined {
    const expandedBoard = this.expandFenBoard();
    const char = expandedBoard.charAt(coord.getFenIdx());
    const pieceString = char !== '1' ? char as PieceString : undefined;
    return pieceString !== undefined ? new Piece(pieceString) : undefined;
  }

  expandFenBoard(): string {
    return this.board
      .replace(/9/g, '111111111')
      .replace(/8/g, '11111111')
      .replace(/7/g, '1111111')
      .replace(/6/g, '111111')
      .replace(/5/g, '11111')
      .replace(/4/g, '1111')
      .replace(/3/g, '111')
      .replace(/2/g, '11');
  }

  flipBoard(): string {
    return this.board.split('/').map((line: string): string => {
      return [...line].reverse().join('');
    }).join('/');
  }

  generateMovesFromSrc(src: Coordinate): Move[] {
    const moves: Move[] = [];
    const piece = this.getPieceAt(src);
    if (piece) {
      const pattern: number[] = piece.movementPattern;

      for (let i = 0; i < Object.keys(Direction).length; i++) {
        const directionLimit = pattern[i];
        for (let n = 0; n < directionLimit; n++) {
          const directionOffsets = piece.getOwner() === 'w'
            ? WHITE_DIRECTION_OFFSETS
            : BLACK_DIRECTION_OFFSETS;
          const trgIdx = src.getFenIdx() + directionOffsets[i] * (n + 1);
          const trg = Coordinate.fromFenIdx(trgIdx);
          const trgPiece = this.getPieceAt(trg);

          // Move in this direction blocked by friendly piece, can't move any further
          if (trgPiece && trgPiece.getOwner() === this.turn) {
            break;
          }

          // Can move here!
          moves.push(new Move(src, trg));

          // Move in this direction blocked by opponent piece, can't move any further
          if (trgPiece && trgPiece.getOwner() !== this.turn) {
            break;
          }
        }
      }
    }
    return moves;
  }

  private validateMove(move: Move): boolean {
    const moves: Move[] = this.generateMovesFromSrc(move.src);

    let isPresent = false;
    for (let i = 0; i < moves.length; i++) {
      const currMove: Move = moves[i];
      if (move.equals(currMove)) {
        isPresent = true;
        break;
      }
    }
    return isPresent;
  }

  performMove(move: Move): void {
    if (this.validateMove(move)) {
      const expandedFen = this.expandFenBoard();
      const srcIdx = move.src.getFenIdx();
      const trgIdx = move.trg.getFenIdx();
      const srcChar = expandedFen.charAt(srcIdx);
      const trgPiece = this.getPieceAt(move.trg);

      const trgReplacedFen = expandedFen.substring(0, trgIdx) + srcChar + expandedFen.substring(trgIdx + 1);
      const newExpandedFen = trgReplacedFen.substring(0, srcIdx) + '1' + trgReplacedFen.substring(srcIdx + 1);
      this.board = FenState.condenseBoard(newExpandedFen);
      this.turn = this.turn === 'w' ? 'b' : 'w';
      this.whiteCaptures = trgPiece && this.turn === 'w'
        ? this.whiteCaptures !== '-'
          ? this.whiteCaptures + trgPiece.pieceString
          : trgPiece.pieceString
        : this.whiteCaptures;
      this.blackCaptures = trgPiece && this.turn === 'b'
        ? this.blackCaptures !== '-'
          ? this.blackCaptures + trgPiece.pieceString
          : trgPiece.pieceString
        : this.blackCaptures;
      this.turnNumber = this.turn === 'w' ? this.turnNumber + 1 : this.turnNumber;
    }
  }

  static condenseBoard(board: string): string {
    return board
      .replace(/111111111/g, '9')
      .replace(/11111111/g, '8')
      .replace(/1111111/g, '7')
      .replace(/111111/g, '6')
      .replace(/11111/g, '5')
      .replace(/1111/g, '4')
      .replace(/111/g, '3')
      .replace(/11/g, '2');
  }
}
