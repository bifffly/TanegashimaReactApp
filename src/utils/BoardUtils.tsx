import {
  Piece, PIECE_TYPE_LOOKUP, PieceColor, PieceType,
} from './PieceUtils';
import { Coordinate } from './CoordinateUtils';
import { Move } from './MoveUtils';
import { type Drop } from './DropUtils';

export enum Player {
  SENTE = 's',
  GOTE = 'g',
}

export const PLAYER_PIECE_COLOR_MAP: Record<Player, PieceColor> = {
  [Player.SENTE]: PieceColor.BLACK,
  [Player.GOTE]: PieceColor.WHITE,
};

export function getOpponent(player: Player): Player {
  return player === Player.SENTE
    ? Player.GOTE
    : Player.SENTE;
}

export const INIT_BOARD: string = 'LKSGOGSKL/1R5B1/PPPPPPPPP/9/9/9/ppppppppp/1b5r1/lksgogskl';
export const INIT_CURR_PLAYING: Player = Player.SENTE;
export const INIT_CAPTURES: Map<PieceType, number> = new Map<PieceType, number>([
  [PieceType.ROOK, 0],
  [PieceType.BISHOP, 0],
  [PieceType.SILVER_GENERAL, 0],
  [PieceType.GOLDEN_GENERAL, 0],
  [PieceType.KNIGHT, 0],
  [PieceType.LANCE, 0],
  [PieceType.PAWN, 0],
]);
export const INIT_TURN: number = 0;

export const SENTE_DIRECTION_OFFSETS: number[] = [-10, 10, -1, 1, -11, -9, 9, 11, -21, -19];
export const GOTE_DIRECTION_OFFSETS: number[] = [10, -10, 1, -1, 9, 11, -9, -11, 21, 19];

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

  currPlaying: Player;

  senteCaptures: Map<PieceType, number>;

  goteCaptures: Map<PieceType, number>;

  turn: number;

  constructor(board: string = INIT_BOARD, currPlaying: Player = INIT_CURR_PLAYING, senteCaptures = new Map<PieceType, number>(INIT_CAPTURES),
    goteCaptures = new Map<PieceType, number>(INIT_CAPTURES), turn: number = INIT_TURN) {
    this.board = board;
    this.currPlaying = currPlaying;
    this.senteCaptures = senteCaptures;
    this.goteCaptures = goteCaptures;
    this.turn = turn;
  }

  private static captureStringToPieceTypeNumberMap(captureString: string): Map<PieceType, number> {
    const captures = new Map(INIT_CAPTURES);
    INIT_CAPTURES.forEach((_, captureType) => {
      const captureChar = PIECE_TYPE_LOOKUP.charAt(captureType);
      const occurrences: number = (captureString.match(new RegExp(`/${captureChar}/g`)) ?? []).length;
      captures.set(captureType, occurrences);
    });
    return captures;
  }

  private static pieceTypeNumberMapToCaptureString(map: Map<PieceType, number>): string {
    let captures: string = '';
    map.forEach((value, key) => {
      captures += PIECE_TYPE_LOOKUP.charAt(key).repeat(value);
    });
    return captures;
  }

  static fromString(fenString: string): BoardState {
    const args: string[] = fenString.split(' ');

    const board = args[0];
    const currPlaying = args[1] as Player;
    const whiteCaptures = BoardState.captureStringToPieceTypeNumberMap(args[2]);
    const blackCaptures = BoardState.captureStringToPieceTypeNumberMap(args[3]);
    const turn = parseInt(args[4]);

    return new BoardState(board, currPlaying, whiteCaptures, blackCaptures, turn);
  }

  public toString(): string {
    return [
      this.board,
      this.currPlaying,
      BoardState.pieceTypeNumberMapToCaptureString(this.senteCaptures),
      BoardState.pieceTypeNumberMapToCaptureString(this.goteCaptures),
      this.turn,
    ].join(' ');
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
  generateLegalMovesFromSrc(src: Coordinate): Move[] {
    const moves: Move[] = [];
    const piece = this.getPieceAt(src);
    if (piece) {
      if (piece.owner !== this.currPlaying) {
        return moves;
      }

      const pattern: number[] = piece.getMovementPattern();

      for (let i = 0; i < Object.keys(Direction).length; i++) {
        const directionLimit = pattern[i];
        for (let n = 0; n < directionLimit; n++) {
          const directionOffsets = piece.owner === Player.SENTE
            ? SENTE_DIRECTION_OFFSETS
            : GOTE_DIRECTION_OFFSETS;
          const trgIdx = src.getFenIdx() + directionOffsets[i] * (n + 1);
          const trg = Coordinate.fromFenIdx(trgIdx);
          const trgPiece = this.getPieceAt(trg);

          // Move in this direction blocked by friendly piece, can't move any further
          if (trgPiece && trgPiece.owner === this.currPlaying) {
            break;
          }

          // Can move here!
          moves.push(new Move(piece.owner, src, trg));

          // Move in this direction blocked by opponent piece, can't move any further
          if (trgPiece && trgPiece.owner !== this.currPlaying) {
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
    const moves: Move[] = this.generateLegalMovesFromSrc(move.src);

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

    const newBoard = BoardState.condenseBoard(newExpandedBoard);
    const newCurrPlaying = getOpponent(this.currPlaying);
    if (trgPiece && this.currPlaying === Player.SENTE) {
      const currOccurrences = this.senteCaptures.get(trgPiece.pieceType)!;
      this.senteCaptures.set(trgPiece.pieceType, currOccurrences + 1);
    }
    if (trgPiece && this.currPlaying === Player.GOTE) {
      const currOccurrences = this.goteCaptures.get(trgPiece.pieceType)!;
      this.goteCaptures.set(trgPiece.pieceType, currOccurrences + 1);
    }
    const newTurn = this.currPlaying === Player.GOTE ? this.turn + 1 : this.turn;

    return new BoardState(newBoard, newCurrPlaying, this.senteCaptures, this.goteCaptures, newTurn);
  }

  generateLegalDropsForPlayer(player: Player): Drop[] {
    console.log(`generating legal drops for player ${player}`);
    return [];
  }

  validateDrop(drop: Drop): boolean {
    return this.currPlaying === Player.SENTE
      ? this.senteCaptures.get(drop.piece.pieceType)! > 0
      : this.goteCaptures.get(drop.piece.pieceType)! > 0;

    /*
    const drops: Drop[] = this.generateLegalDropsForPlayer(drop.piece.owner);

    let isPresent = false;
    for (let i = 0; i < drops.length; i++) {
      const currDrop = drops[i];
      if (drop.equals(currDrop)) {
        isPresent = true;
        break;
      }
    }
    return isPresent;
     */
  }

  performDrop(drop: Drop): BoardState {
    const dropPiece = Piece.fromTypeAndOwner(drop.piece.pieceType, drop.piece.owner);
    const expandedBoard = this.expandBoard();
    console.log(`current expandedBoard: ${expandedBoard}`);
    const trgIdx = drop.trg.getFenIdx();
    console.log(`trgIdx: ${trgIdx}`);
    const newExpandedBoard = expandedBoard.substring(0, trgIdx) + dropPiece.toFenChar() + expandedBoard.substring(trgIdx + 1);
    console.log(`post-drop expandedBoard: ${newExpandedBoard}`);
    const newBoard = BoardState.condenseBoard(newExpandedBoard);
    const newCurrPlaying = getOpponent(this.currPlaying);
    if (this.currPlaying === Player.SENTE) {
      const currOccurrences = this.senteCaptures.get(drop.piece.pieceType)!;
      this.senteCaptures.set(drop.piece.pieceType, currOccurrences - 1);
    }
    if (this.currPlaying === Player.GOTE) {
      const currOccurrences = this.goteCaptures.get(drop.piece.pieceType)!;
      this.goteCaptures.set(drop.piece.pieceType, currOccurrences - 1);
    }
    const newTurn = this.currPlaying === Player.GOTE ? this.turn + 1 : this.turn;

    const newBoardState = new BoardState(newBoard, newCurrPlaying, this.senteCaptures, this.goteCaptures, newTurn);
    console.log(newBoardState.toString());
    return newBoardState;
  }
}
