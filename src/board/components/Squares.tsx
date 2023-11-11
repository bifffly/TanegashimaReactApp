import {
  type ReactElement, useState,
} from 'react';
import { Square } from './Square';
import {
  BoardState,
  START_FEN_STRING,
} from '../../utils/BoardUtils';
import { Move } from '../../utils/MoveUtils';
import { Coordinate } from '../../utils/CoordinateUtils';

interface SquaresProps {
  boardWidth: number
}

export function Squares(props: SquaresProps): ReactElement {
  const [board, setBoard] = useState<BoardState>(new BoardState(START_FEN_STRING));
  const [src, setSrc] = useState<Coordinate>(new Coordinate(-1, -1));
  const [isMoveInitiated, setIsMoveInitiated] = useState<boolean>(false);
  const [possTrgs, setPossTrgs] = useState<Coordinate[]>([]);

  const { boardWidth } = props;

  return (
    <div>
      {[...Array(9)].map((_, row) => {
        return (
          <div
            key={row.toString()}
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              width: boardWidth,
            }}
          >
            {[...Array(9)].map((_, col) => {
              const squareColor = col % 2 === row % 2 ? 'white' : 'black';
              const coord = new Coordinate(row, col);
              const piece = board.getPieceAt(coord);
              const pieceNode = (piece
                ? <p
                  style={{
                    transform: `rotate(${piece.getOwner() === 'w' ? '180' : '0'}deg)`,
                  }}>
                  {piece.displayCharacter}
                </p>
                : <></>
              );

              const handleClick = (): void => {
                if (isMoveInitiated) {
                  const move = new Move(src, coord);
                  if (board.validateMove(move)) {
                    const moveFen = board.performMove(move);
                    setBoard(moveFen);
                  }
                  setIsMoveInitiated(false);
                  setPossTrgs([]);
                } else {
                  setSrc(coord);
                  const moves = board.generateMovesFromSrc(coord);
                  if (moves.length !== 0) {
                    setIsMoveInitiated(true);
                    setPossTrgs(moves.map((move: Move) => {
                      return move.trg;
                    }));
                  }
                }
              };

              let shouldBeHighlighted = false;
              for (let i = 0; i < possTrgs.length; i++) {
                if (coord.equals(possTrgs[i])) {
                  shouldBeHighlighted = true;
                  break;
                }
              }

              return (
                <Square
                  key={`${row}${col}`}
                  squareColor={squareColor}
                  highlighted={shouldBeHighlighted}
                  boardWidth={boardWidth}
                  onClick={handleClick}
                >
                  {pieceNode}
                </Square>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
