import { Coordinate } from "./CoordinateUtils";
import {Piece, PieceString} from "./PieceUtils";

export const START_FEN_STRING: string = 'LKSGOGSKL/1R5B1/PPPPPPPPP/9/9/9/ppppppppp/1b5r1/lksgogskl b - - 0';

export type Player = 'w' | 'b';

export class FenState {
  readonly board: string;
  readonly turn: Player;
  readonly whiteCaptures: string;
  readonly blackCaptures: string;
  readonly turnNumber: number;

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
    return pieceString ? new Piece(pieceString) : undefined;
  }

  expandFenBoard(): string {
    return this.board
      .replace(/9/g, "111111111")
      .replace(/8/g, "11111111")
      .replace(/7/g, "1111111")
      .replace(/6/g, "111111")
      .replace(/5/g, "11111")
      .replace(/4/g, "1111")
      .replace(/3/g, "111")
      .replace(/2/g, "11");
  }

  static condenseBoard(board: string): string {
    return board
      .replace(/111111111/g, "9")
      .replace(/11111111/g, "8")
      .replace(/1111111/g, "7")
      .replace(/111111/g, "6")
      .replace(/11111/g, "5")
      .replace(/1111/g, "4")
      .replace(/111/g, "3")
      .replace(/11/g, "2")
  }
}
