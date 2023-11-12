import { Player } from './BoardUtils';

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
};

export const DISPLAY_CHARACTERS: Record<string, string> = {
  o: '玉',
  O: '王',
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

export const PIECE_PROMOTION_MAP: Record<string, string> = {
  r: 'd',
  R: 'D',
  b: 'h',
  B: 'H',
  s: 'z',
  S: 'Z',
  k: 'n',
  K: 'N',
  l: 'c',
  L: 'C',
  p: 't',
  P: 'T',
};

export class Piece {
  readonly pieceString: string;

  readonly movementPattern: number[];

  readonly displayCharacter: string;

  constructor(pieceString: string) {
    this.pieceString = pieceString;
    this.movementPattern = MOVEMENT_PATTERNS[pieceString.toLowerCase()];
    this.displayCharacter = DISPLAY_CHARACTERS[
      pieceString.match(/[Oo]/)
        ? pieceString
        : pieceString.toLowerCase()
    ];
  }

  getOwner(): Player {
    return /[a-z]/g.test(this.pieceString)
      ? Player.BLACK
      : Player.WHITE;
  }
}
