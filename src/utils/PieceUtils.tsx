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

export const DISPLAY_CHARACTERS: Record<string, string | Record<Player, string>> = {
  [PieceType.KING]: {
    [Player.BLACK]: '玉',
    [Player.WHITE]: '王',
  },
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

export class Piece {
  readonly pieceType: PieceType;

  readonly owner: Player;

  readonly movementPattern: number[];

  readonly displayCharacter: string;

  constructor(pieceChar: string) {
    this.pieceType = PIECE_TYPE_LOOKUP.indexOf(pieceChar.toLowerCase());
    this.owner = /[A-Z]/g.test(pieceChar)
      ? Player.WHITE
      : Player.BLACK;
    this.movementPattern = MOVEMENT_PATTERNS[this.pieceType];
    this.displayCharacter = this.pieceType === PieceType.KING
      ? (DISPLAY_CHARACTERS[this.pieceType] as Record<Player, string>)[this.owner]
      : DISPLAY_CHARACTERS[this.pieceType] as string;
  }

  isPromotable(): boolean {
    return !!PIECE_PROMOTION_MAP[this.pieceType];
  }

  isPromoted(): boolean {
    return Object.values(PIECE_PROMOTION_MAP).includes(this.pieceType);
  }

  promote(): Piece | undefined {
    if (this.isPromotable()) {
      const promotedTypeChar: string = PIECE_TYPE_LOOKUP[PIECE_PROMOTION_MAP[this.pieceType]!];
      return this.owner === Player.WHITE
        ? new Piece(promotedTypeChar.toUpperCase())
        : new Piece(promotedTypeChar);
    }
    return undefined;
  }

  toFenChar(): string {
    const pieceTypeChar: string = PIECE_TYPE_LOOKUP[this.pieceType];
    return this.owner === Player.WHITE
      ? pieceTypeChar.toUpperCase()
      : pieceTypeChar;
  }
}
