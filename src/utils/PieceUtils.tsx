import { Player } from './BoardUtils';

export enum PieceType {
  KING,
  ROOK,
  BISHOP,
  GOLDEN_GENERAL,
  SILVER_GENERAL,
  KNIGHT,
  LANCE,
  PAWN,
  DRAGON,
  HORSE,
  PROMOTED_SILVER_GENERAL,
  PROMOTED_KNIGHT,
  PROMOTED_LANCE,
  PROMOTED_PAWN,
}

export const MOVEMENT_PATTERNS: Record<PieceType, number[]> = {
  [PieceType.KING]: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [PieceType.ROOK]: [8, 8, 8, 8, 0, 0, 0, 0, 0, 0],
  [PieceType.BISHOP]: [0, 0, 0, 0, 8, 8, 8, 8, 0, 0],
  [PieceType.GOLDEN_GENERAL]: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [PieceType.SILVER_GENERAL]: [1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
  [PieceType.KNIGHT]: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [PieceType.LANCE]: [8, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [PieceType.PAWN]: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [PieceType.DRAGON]: [8, 8, 8, 8, 1, 1, 1, 1, 0, 0],
  [PieceType.HORSE]: [1, 1, 1, 1, 8, 8, 8, 8, 0, 0],
  [PieceType.PROMOTED_SILVER_GENERAL]: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [PieceType.PROMOTED_KNIGHT]: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [PieceType.PROMOTED_LANCE]: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [PieceType.PROMOTED_PAWN]: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
};

export const DISPLAY_CHARACTERS = (player: Player): Record<string, string> => {
  return {
    [PieceType.KING]: player === Player.BLACK
      ? '玉'
      : '王',
    [PieceType.ROOK]: '飛',
    [PieceType.BISHOP]: '角',
    [PieceType.GOLDEN_GENERAL]: '金',
    [PieceType.SILVER_GENERAL]: '銀',
    [PieceType.KNIGHT]: '桂',
    [PieceType.LANCE]: '香',
    [PieceType.PAWN]: '歩',
    [PieceType.DRAGON]: '龍',
    [PieceType.HORSE]: '馬',
    [PieceType.PROMOTED_SILVER_GENERAL]: '全',
    [PieceType.PROMOTED_KNIGHT]: '圭',
    [PieceType.PROMOTED_LANCE]: '杏',
    [PieceType.PROMOTED_PAWN]: 'と',
  };
};

export const PIECE_TYPE_LOOKUP: string = 'orbgsklpdhznlt';

export const PIECE_PROMOTION_MAP: Record<PieceType, PieceType | undefined> = {
  [PieceType.KING]: undefined,
  [PieceType.ROOK]: PieceType.DRAGON,
  [PieceType.BISHOP]: PieceType.HORSE,
  [PieceType.GOLDEN_GENERAL]: undefined,
  [PieceType.SILVER_GENERAL]: PieceType.PROMOTED_SILVER_GENERAL,
  [PieceType.KNIGHT]: PieceType.PROMOTED_KNIGHT,
  [PieceType.LANCE]: PieceType.PROMOTED_LANCE,
  [PieceType.PAWN]: PieceType.PROMOTED_PAWN,
  [PieceType.DRAGON]: undefined,
  [PieceType.HORSE]: undefined,
  [PieceType.PROMOTED_SILVER_GENERAL]: undefined,
  [PieceType.PROMOTED_KNIGHT]: undefined,
  [PieceType.PROMOTED_LANCE]: undefined,
  [PieceType.PROMOTED_PAWN]: undefined,
};

/**
 * Class representing a piece.
 */
export class Piece {
  readonly pieceType: PieceType;

  readonly owner: Player;

  readonly movementPattern: number[];

  readonly displayCharacter: string;

  /**
   * Constructs a piece object.
   *
   * lower case -> black piece
   * upper case -> white piece
   *
   * o -> king
   * r -> rook
   * b -> bishop
   * g -> golden general
   * s -> silver general
   * k -> knight
   * l -> lance
   * p -> pawn
   * d -> dragon (promoted rook)
   * h -> horse (promoted bishop)
   * z -> promoted silver general
   * n -> promoted knight
   * c -> promoted lance
   * t -> promoted pawn
   *
   * @param pieceChar
   */
  constructor(pieceChar: string) {
    this.pieceType = PIECE_TYPE_LOOKUP.indexOf(pieceChar.toLowerCase());
    this.owner = /[A-Z]/g.test(pieceChar)
      ? Player.WHITE
      : Player.BLACK;
    this.movementPattern = MOVEMENT_PATTERNS[this.pieceType];
    this.displayCharacter = DISPLAY_CHARACTERS(this.owner)[this.pieceType];
  }

  static fromTypeAndOwner(pieceType: PieceType, owner: Player): Piece {
    const pieceTypeChar: string = PIECE_TYPE_LOOKUP[pieceType];
    return new Piece(owner === Player.BLACK
      ? pieceTypeChar.toUpperCase()
      : pieceTypeChar);
  }

  /**
   * Checks if the piece type is eligible for promotion.
   *
   * rook -> dragon
   * bishop -> horse
   * knight -> promoted knight
   * silver general -> promoted silver general
   * lance -> promoted lance
   * pawn -> promoted pawn
   */
  isPromotable(): boolean {
    return !!PIECE_PROMOTION_MAP[this.pieceType];
  }

  /**
   * Checks if the piece type is a promoted piece.
   */
  isPromoted(): boolean {
    return Object.values(PIECE_PROMOTION_MAP).includes(this.pieceType);
  }

  /**
   * Promotes the piece. If the piece type is not eligible for promotion
   * (king, golden general, or any already promoted piece), returns undefined.
   */
  promote(): Piece | undefined {
    if (this.isPromotable()) {
      const promotedTypeChar: string = PIECE_TYPE_LOOKUP[PIECE_PROMOTION_MAP[this.pieceType]!];
      return this.owner === Player.WHITE
        ? new Piece(promotedTypeChar.toUpperCase())
        : new Piece(promotedTypeChar);
    }
    return undefined;
  }

  /**
   * Demotes the piece. This happens when a player captures a promoted piece.
   * We flip PIECE_PROMOTION_MAP to see what piece type a promoted piece demotes to.
   * If the piece is not eligible for promotion, returns undefined.
   *
   * dragon -> rook
   * horse -> bishop
   * promoted knight -> knight
   * promoted silver general -> silver general
   * promoted lance -> lance
   * promoted pawn -> pawn
   */
  demote(): Piece | undefined {
    if (this.isPromoted()) {
      let demotedPiece: Piece | undefined;
      (Object.entries(PIECE_PROMOTION_MAP).filter(([, value]) => value !== undefined) as Array<[string, PieceType]>)
        .forEach(([key, value]: [string, PieceType]) => {
          if (this.pieceType === value) {
            demotedPiece = Piece.fromTypeAndOwner(parseInt(key), this.owner);
          }
        });
      return demotedPiece;
    }
    return undefined;
  }

  /**
   * Returns the way this piece would be represented in FEN notation.
   */
  toFenChar(): string {
    const pieceTypeChar: string = PIECE_TYPE_LOOKUP[this.pieceType];
    return this.owner === Player.WHITE
      ? pieceTypeChar.toUpperCase()
      : pieceTypeChar;
  }
}
