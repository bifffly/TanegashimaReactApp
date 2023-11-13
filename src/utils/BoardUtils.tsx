import { Piece } from './PieceUtils';
import { Coordinate } from './CoordinateUtils';
import { Move } from './MoveUtils';

export const START_FEN_STRING: string = 'LKSGOGSKL/1R5B1/PPPPPPPPP/9/9/9/ppppppppp/1b5r1/lksgogskl b - - 0';

export enum Player {
  WHITE = 'w',
  BLACK = 'b',
}

export const BLACK_DIRECTION_OFFSETS: number[] = [-10, 10, -1, 1, -11, -9, 9, 11, -21, -19];
export const WHITE_DIRECTION_OFFSETS: number[] = [10, -10, 1, -1, 9, 11, -9, -11, 21, 19];

/**
 * Any of the eight cardinal directions a piece can move in (plus two for the L-shaped knight moves)
 */
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

/**
 * Class for representing the state of the shogi board.
 */
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

  /**
   * Given a coordinate, returns the piece on the board at that spot.
   * If no piece exists there, returns undefined.
   *
   * @param coord desired coordinate
   */
  getPieceAt(coord: Coordinate): Piece | undefined {
    const expandedBoard = this.expandBoard();
    const char = expandedBoard.charAt(coord.getFenIdx());
    const pieceString = char !== '1' ? char : undefined;
    return pieceString ? new Piece(pieceString) : undefined;
  }

  /**
   * Expands the FEN representation of the board.
   * Replaces concatenated empty spaces with `1` for every empty space.
   */
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

  /**
   * Condenses an expanded FEN representation of a board.
   * If any consecutive `1`s exist, concatenates them.
   *
   * @param board FEN representation to condense
   */
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

  /**
   * Generates a list of legal moves the piece at the coordinate can make.
   *
   * @param src starting coordinate of the move
   */
  generateMovesFromSrc(src: Coordinate): Move[] {
    const moves: Move[] = [];
    const piece = this.getPieceAt(src);
    if (piece) {
      if (piece.owner !== this.turn) {
        return moves;
      }

      const pattern: number[] = piece.movementPattern;

      for (let i = 0; i < Object.keys(Direction).length; i++) {
        const directionLimit = pattern[i];
        for (let n = 0; n < directionLimit; n++) {
          const directionOffsets = piece.owner === Player.WHITE
            ? WHITE_DIRECTION_OFFSETS
            : BLACK_DIRECTION_OFFSETS;
          const trgIdx = src.getFenIdx() + directionOffsets[i] * (n + 1);
          const trg = Coordinate.fromFenIdx(trgIdx);
          const trgPiece = this.getPieceAt(trg);

          // Move in this direction blocked by friendly piece, can't move any further
          if (trgPiece && trgPiece.owner === this.turn) {
            break;
          }

          // Can move here!
          moves.push(new Move(piece.owner, src, trg));

          // Move in this direction blocked by opponent piece, can't move any further
          if (trgPiece && trgPiece.owner !== this.turn) {
            break;
          }
        }
      }
    }
    return moves;
  }

  /**
   * Checks whether the move in question is legal.
   *
   * @param move move to be validated
   */
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

  /**
   * Performs the requested move, assuming it has already been checked for legality.
   *
   * @param move move to be performed
   */
  performMove(move: Move): BoardState {
    const expandedBoard = this.expandBoard();
    const srcIdx = move.src.getFenIdx();
    const trgIdx = move.trg.getFenIdx();
    const srcChar = expandedBoard.charAt(srcIdx);
    let srcPiece = new Piece(srcChar);
    if (move.isPromotable() && srcPiece.isPromotable()) {
      srcPiece = srcPiece.promote()!;
    }
    let trgPiece = this.getPieceAt(move.trg);
    // Promoted pieces get demoted when in hand
    if (trgPiece && trgPiece.isPromoted()) {
      trgPiece = trgPiece.demote();
    }

    const trgReplacedBoard = expandedBoard.substring(0, trgIdx) + srcPiece.toFenChar() + expandedBoard.substring(trgIdx + 1);
    const newExpandedBoard = trgReplacedBoard.substring(0, srcIdx) + '1' + trgReplacedBoard.substring(srcIdx + 1);

    const moveBoard = BoardState.condenseBoard(newExpandedBoard);
    const moveTurn = this.turn === Player.WHITE ? Player.BLACK : Player.WHITE;
    const moveWhiteCaptures = trgPiece && this.turn === Player.WHITE
      ? this.whiteCaptures !== '-'
        ? this.whiteCaptures + trgPiece.toFenChar().toLowerCase()
        : trgPiece.toFenChar().toLowerCase()
      : this.whiteCaptures;
    const moveBlackCaptures = trgPiece && this.turn === Player.BLACK
      ? this.blackCaptures !== '-'
        ? this.blackCaptures + trgPiece.toFenChar().toLowerCase()
        : trgPiece.toFenChar().toLowerCase()
      : this.blackCaptures;
    const moveTurnNumber = this.turn === Player.WHITE ? this.turnNumber + 1 : this.turnNumber;

    const moveFenString = [moveBoard, moveTurn, moveWhiteCaptures, moveBlackCaptures, moveTurnNumber].join(' ');
    return new BoardState(moveFenString);
  }
}
