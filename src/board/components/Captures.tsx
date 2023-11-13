import { type ReactElement } from 'react';
import {
  Box, createTheme, Grid, ThemeProvider, Typography,
} from '@mui/material';
import {
  type BoardState, Player, PLAYER_PIECE_COLOR_MAP,
} from '../../utils/BoardUtils';
import {
  DISPLAY_CHARACTERS, Piece, type PieceType,
} from '../../utils/PieceUtils';
import {
  FLIPPED_PIECE_ORIENTATION, UNFLIPPED_PIECE_ORIENTATION,
} from './Squares';

export interface CapturesProps {
  boardState: BoardState
  player: Player
  dropSrc: Piece | undefined
  setDropSrc: (dropSrc: Piece | undefined) => void
}

export const PRESENT_CAPTURE_COLOR = {
  color: '#000000',
};

export const ABSENT_CAPTURE_COLOR = {
  color: '#BBBBBB',
};

export const HIGHLIGHTED_CAPTURE_COLOR = {
  color: '#FF0000',
};

export function Captures(props: CapturesProps): ReactElement {
  const {
    boardState,
    player,
    dropSrc,
    setDropSrc,
  } = props;

  const capturedPieces: Map<PieceType, number> = player === Player.SENTE
    ? boardState.senteCaptures
    : boardState.goteCaptures;

  const pieceOrientation = player === Player.SENTE
    ? UNFLIPPED_PIECE_ORIENTATION
    : FLIPPED_PIECE_ORIENTATION;

  const size = {
    aspectRatio: '1',
  };

  const center = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const theme = createTheme();
  theme.typography.h4 = {
    fontSize: '1rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.5rem',
    },
  };

  const piecesInHand: ReactElement[] = [];

  if (player === Player.SENTE) {
    // Pad with 2 empty squares to align to bottom of Grid
    for (let i = 0; i < 2; i++) {
      piecesInHand.push(
        <Grid
          key={i}
          item
          xs={1}
        >
          <Box
            sx={{
              ...size,
            }}
          ></Box>
        </Grid>,
      );
    }
  }

  capturedPieces.forEach((freq, pieceType) => {
    const displayChar: string = DISPLAY_CHARACTERS(PLAYER_PIECE_COLOR_MAP[player])[pieceType];

    const color = dropSrc && pieceType === dropSrc.pieceType && player === dropSrc.owner
      ? freq > 0
        ? HIGHLIGHTED_CAPTURE_COLOR
        : ABSENT_CAPTURE_COLOR
      : freq > 0
        ? PRESENT_CAPTURE_COLOR
        : ABSENT_CAPTURE_COLOR;

    const handleClick = (): void => {
      if (player === boardState.currPlaying) {
        setDropSrc(Piece.fromTypeAndOwner(pieceType, player));
      }
    };

    piecesInHand.push(
      <Grid
        key={pieceType}
        item
        xs={1}
      >
        <Box
          onClick={handleClick}
          sx={{
            ...size,
            ...center,
          }}
        >
          <ThemeProvider theme={theme}>
            <Typography
              variant='h4'
              sx={{
                ...color,
              }}
            >
              {displayChar}<sub>{freq}</sub>
            </Typography>
          </ThemeProvider>
        </Box>
      </Grid>,
    );
  });

  return (
    <Grid
      container
      columns={1}
      sx={{
        ...pieceOrientation,
      }}
    >
      {piecesInHand}
    </Grid>
  );
}
