import { Square } from './Square';
import {
  type ReactElement,
  useState,
} from 'react';
import { Move } from '../../utils/MoveUtils';
import { Coordinate } from '../../utils/CoordinateUtils';
import { type FenState } from '../../utils/FenUtils';

interface SquaresProps {
  boardWidth: number
  fen: FenState
}

export function Squares(props: SquaresProps): ReactElement {
  const [src, setSrc] = useState<Coordinate>(new Coordinate(-1, -1));
  const [isMoveInitiated, setIsMoveInitiated] = useState<boolean>(false);
  const [possTrgs, setPossTrgs] = useState<Coordinate[]>([]);
  const {
    boardWidth,
    fen,
  } = props;

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
              const piece = fen.getPieceAt(coord);
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
                  fen.performMove(move);
                  console.debug(fen);
                  setIsMoveInitiated(false);
                  setPossTrgs([]);
                } else {
                  setSrc(coord);
                  setIsMoveInitiated(true);
                  const moves = fen.generateMovesFromSrc(coord);
                  setPossTrgs(moves.map((move: Move) => {
                    return move.trg;
                  }));
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
