import {
  type ReactElement, useState,
} from 'react';
import {
  createTheme, Grid, ThemeProvider, Typography,
} from '@mui/material';
import {
  type BoardState, Player, PLAYER_PIECE_COLOR_MAP,
} from '../../utils/BoardUtils';
import { Move } from '../../utils/MoveUtils';
import { Coordinate } from '../../utils/CoordinateUtils';
import { Drop } from '../../utils/DropUtils';
import { type Piece } from '../../utils/PieceUtils';
import { Square } from './Square';

export const UNFLIPPED_PIECE_ORIENTATION = {
  transform: 'rotate(0deg)',
};

export const FLIPPED_PIECE_ORIENTATION = {
  transform: 'rotate(180deg)',
};

const PROMOTED_PIECE_COLOR = {
  color: '#FF0000',
};

const PROMOTED_HIGHLIGHTED_PIECE_COLOR = {
  color: '#800000',
};

const UNPROMOTED_PIECE_COLOR = {
  color: '#000000',
};

interface SquaresProps {
  boardState: BoardState
  setBoardState: (boardState: BoardState) => void
  dropSrc: Piece | undefined
  setDropSrc: (dropType: Piece | undefined) => void
}

export function Squares(props: SquaresProps): ReactElement {
  const {
    boardState,
    setBoardState,
    dropSrc,
    setDropSrc,
  } = props;

  const [src, setSrc] = useState<Coordinate>(new Coordinate(-1, -1));
  const [isMoveInitiated, setIsMoveInitiated] = useState<boolean>(false);
  const [possTrgs, setPossTrgs] = useState<Coordinate[]>([]);

  const theme = createTheme();
  theme.typography.h4 = {
    fontSize: '1rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.5rem',
    },
  };

  return (
    <Grid
      container
      spacing={0}
    >
      {[...Array(9)].map((_, row) => {
        return (
          <Grid
            key={row}
            container
            item
            columns={9}
            alignItems='stretch'
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
            }}
          >
            {[...Array(9)].map((_, col) => {
              const squareColor = col % 2 === row % 2 ? 'white' : 'black';
              const coord = new Coordinate(row, col);

              const handleClick = (): void => {
                if (isMoveInitiated) {
                  const move = new Move(boardState.currPlaying, src, coord);
                  if (boardState.validateMove(move)) {
                    const moveFen = boardState.performMove(move);
                    setBoardState(moveFen);
                  }
                  setIsMoveInitiated(false);
                  setPossTrgs([]);
                } else if (dropSrc) {
                  const drop = new Drop(dropSrc, coord);
                  if (boardState.validateDrop(drop)) {
                    const dropFen = boardState.performDrop(drop);
                    setBoardState(dropFen);
                  }
                  setDropSrc(undefined);
                } else {
                  setSrc(coord);
                  const moves = boardState.generateLegalMovesFromSrc(coord);
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

              const piece = boardState.getPieceAt(coord);
              let pieceNode = (<></>);
              if (piece) {
                const pieceOrientation = piece.owner === Player.SENTE
                  ? UNFLIPPED_PIECE_ORIENTATION
                  : FLIPPED_PIECE_ORIENTATION;
                const pieceColor = piece.isPromoted()
                  ? shouldBeHighlighted
                    ? PROMOTED_HIGHLIGHTED_PIECE_COLOR
                    : PROMOTED_PIECE_COLOR
                  : UNPROMOTED_PIECE_COLOR;
                pieceNode = (<ThemeProvider theme={theme}>
                  <Typography
                    variant='h4'
                    sx={{
                      ...pieceOrientation,
                      ...pieceColor,
                    }}
                  >
                    {piece.getDisplayCharacter(PLAYER_PIECE_COLOR_MAP[piece.owner])}
                  </Typography>
                </ThemeProvider>);
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
