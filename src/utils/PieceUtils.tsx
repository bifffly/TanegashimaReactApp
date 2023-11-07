export const MOVEMENT_PATTERNS: Record<string, number[]> = {
  o: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  r: [8, 8, 8, 8, 0, 0, 0, 0, 0, 0],
  b: [0, 0, 0, 0, 8, 8, 8, 8, 0, 0],
  g: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  s: [1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
  k: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  l: [8, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  p: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  d: [8, 8, 8, 8, 1, 1, 1, 1, 0, 0],
  h: [1, 1, 1, 1, 8, 8, 8, 8, 0, 0],
  z: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  n: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  c: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  t: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
}

export const DISPLAY_CHARACTERS: Record<string, string> = {
  o: '王',
  r: '飛',
  b: '角',
  g: '金',
  s: '銀',
  k: '桂',
  l: '香',
  p: '歩',
  d: '龍',
  h: '馬',
  z: '全',
  n: '圭',
  c: '杏',
  t: 'と',
};

export type King = 'O' | 'o';
export type Rook = 'R' | 'r';
export type Bishop = 'B' | 'b';
export type GoldGeneral = 'G' | 'g';
export type SilverGeneral = 'S' | 's';
export type Knight = 'K' | 'k';
export type Lance = 'L' | 'l';
export type Pawn = 'P' | 'p';
export type Dragon = 'D' | 'd';
export type Horse = 'H' | 'h';
export type PromotedGeneral = 'Z' | 'z';
export type PromotedKnight = 'N' | 'n';
export type PromotedLance = 'C' | 'c';
export type PromotedPawn = 'T' | 't';

export type PieceString = King
  | Rook
  | Bishop
  | GoldGeneral
  | SilverGeneral
  | Knight
  | Lance
  | Pawn
  | Dragon
  | Horse
  | PromotedGeneral
  | PromotedKnight
  | PromotedLance
  | PromotedPawn;

export class Piece {
  readonly pieceString: PieceString;
  readonly movementPattern: number[];
  readonly displayCharacter: string;

  constructor(pieceString: PieceString) {
    this.pieceString = pieceString;
    this.movementPattern = MOVEMENT_PATTERNS[pieceString.toLowerCase()];
    this.displayCharacter = DISPLAY_CHARACTERS[pieceString.toLowerCase()];
  }

  getOwner(): string {
    return /[a-z]/g.test(this.pieceString)
      ? 'b'
      : 'w';
  }
}
