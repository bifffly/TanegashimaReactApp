import {
  type ReactElement, useState,
} from 'react';
import {
  Grid, Typography,
} from '@mui/material';
import {
  BoardState, Player,
  START_FEN_STRING,
} from '../../utils/BoardUtils';
import { Move } from '../../utils/MoveUtils';
import { Coordinate } from '../../utils/CoordinateUtils';
import { Square } from './Square';

export function Squares(): ReactElement {
  const [board, setBoard] = useState<BoardState>(new BoardState(START_FEN_STRING));
  const [src, setSrc] = useState<Coordinate>(new Coordinate(-1, -1));
  const [isMoveInitiated, setIsMoveInitiated] = useState<boolean>(false);
  const [possTrgs, setPossTrgs] = useState<Coordinate[]>([]);

  return (
    <Grid container spacing={0}>
      {[...Array(9)].map((_, row) => {
        return (
          <Grid
            container
            item
            xs={12}
            spacing={0}
            columns={9}
            alignItems='stretch'
            key={row}
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
            }}
          >
            {[...Array(9)].map((_, col) => {
              const squareColor = col % 2 === row % 2 ? 'white' : 'black';
              const coord = new Coordinate(row, col);
              const piece = board.getPieceAt(coord);
              const pieceNode = (piece
                ? <Typography
                  variant='h4'
                  style={{
                    transform: `rotate(${piece.getOwner() === Player.WHITE ? '180' : '0'}deg)`,
                  }}>
                  {piece.displayCharacter}
                </Typography>
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
                  onClick={handleClick}
                >
                  {pieceNode}
                </Square>
              );
            })}
          </Grid>
        );
      })}
    </Grid>
  );
}
