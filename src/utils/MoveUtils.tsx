import { Coordinate } from "./CoordinateUtils";
import { FenState } from "./FenUtils";

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

export function generateMovesFromSrc(fen: FenState, src: Coordinate): Move[] {
  const moves: Move[] = [];
  const piece = fen.getPieceAt(src);
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
        const trgPiece = fen.getPieceAt(trg);

        // Move in this direction blocked by friendly piece, can't move any further
        if (trgPiece && trgPiece.getOwner() === fen.turn) {
          break;
        }

        // Can move here!
        moves.push(new Move(src, trg));

        // Move in this direction blocked by opponent piece, can't move any further
        if (trgPiece && trgPiece.getOwner() !== fen.turn) {
          break;
        }
      }
    }
  }
  return moves;
}

function validateMove(fen: FenState, move: Move): boolean {
  const moves: Move[] = generateMovesFromSrc(fen, move.src);

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

export function performMove(fen: FenState, move: Move): FenState {
  if (validateMove(fen, move)) {
    const expandedFen = fen.expandFenBoard();
    const srcIdx = move.src.getFenIdx();
    const trgIdx = move.trg.getFenIdx();
    const srcChar = expandedFen.charAt(srcIdx);
    const trgPiece = fen.getPieceAt(move.trg);

    const trgReplacedFen = expandedFen.substring(0, trgIdx) + srcChar + expandedFen.substring(trgIdx + 1);
    const newExpandedFen = trgReplacedFen.substring(0, srcIdx) + '1' + trgReplacedFen.substring(srcIdx + 1);
    const newFenBoard = FenState.condenseBoard(newExpandedFen);
    const newTurn = fen.turn === 'w' ? 'b' : 'w';
    const newWhiteCaptures = trgPiece && fen.turn === 'w'
      ? fen.whiteCaptures !== '-'
        ? fen.whiteCaptures + trgPiece
        : trgPiece
      : fen.whiteCaptures;
    const newBlackCaptures = trgPiece && fen.turn === 'b'
      ? fen.blackCaptures !== '-'
        ? fen.blackCaptures + trgPiece
        : trgPiece
      : fen.blackCaptures;
    const newTurnNumber = fen.turn === 'w' ? fen.turnNumber + 1 : fen.turnNumber;
    const newFenString = [newFenBoard, newTurn, newWhiteCaptures, newBlackCaptures, newTurnNumber].join(" ");
    return new FenState(newFenString);
  }
  return fen;
}