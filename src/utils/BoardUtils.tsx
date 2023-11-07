import { Coordinate } from './CoordinateUtils';
import {
  Piece,
  type PieceString,
} from './PieceUtils';
import { Move } from './MoveUtils';

export const START_FEN_STRING: string = 'LKSGOGSKL/1R5B1/PPPPPPPPP/9/9/9/ppppppppp/1b5r1/lksgogskl b - - 0';

export enum Player {
  WHITE = 'w',
  BLACK = 'b',
}

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

export class BoardState {
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
    const expandedBoard = this.expandBoard();
    const char = expandedBoard.charAt(coord.getFenIdx());
    const pieceString = char !== '1' ? char as PieceString : undefined;
    return pieceString ? new Piece(pieceString) : undefined;
  }

  expandBoard(): string {
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

  generateMovesFromSrc(src: Coordinate): Move[] {
    const moves: Move[] = [];
    const piece = this.getPieceAt(src);
    if (piece) {
      if (piece.getOwner() !== this.turn) {
        return moves;
      }

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

  validateMove(move: Move): boolean {
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

  performMove(move: Move): BoardState {
    const expandedBoard = this.expandBoard();
    const srcIdx = move.src.getFenIdx();
    const trgIdx = move.trg.getFenIdx();
    const srcChar = expandedBoard.charAt(srcIdx);
    const trgPiece = this.getPieceAt(move.trg);

    const trgReplacedBoard = expandedBoard.substring(0, trgIdx) + srcChar + expandedBoard.substring(trgIdx + 1);
    const newExpandedBoard = trgReplacedBoard.substring(0, srcIdx) + '1' + trgReplacedBoard.substring(srcIdx + 1);

    const moveBoard = BoardState.condenseBoard(newExpandedBoard);
    const moveTurn = this.turn === Player.WHITE ? Player.BLACK : Player.WHITE;
    const moveWhiteCaptures = trgPiece && this.turn === Player.WHITE
      ? this.whiteCaptures !== '-'
        ? this.whiteCaptures + trgPiece.pieceString
        : trgPiece.pieceString
      : this.whiteCaptures;
    const moveBlackCaptures = trgPiece && this.turn === Player.BLACK
      ? this.blackCaptures !== '-'
        ? this.blackCaptures + trgPiece.pieceString
        : trgPiece.pieceString
      : this.blackCaptures;
    const moveTurnNumber = this.turn === 'w' ? this.turnNumber + 1 : this.turnNumber;

    const moveFenString = [moveBoard, moveTurn, moveWhiteCaptures, moveBlackCaptures, moveTurnNumber].join(' ');
    return new BoardState(moveFenString);
  }
}
