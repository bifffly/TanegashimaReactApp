import {
  type ReactElement, useState,
} from 'react';
import { Grid } from '@mui/material';
import {
  BoardState, Player,
} from '../../utils/BoardUtils';
import { type Piece } from '../../utils/PieceUtils';
import { Captures } from './Captures';
import { Squares } from './Squares';

const PLAYER = Player.SENTE;
const OPPONENT = Player.GOTE;

export function Board(): ReactElement {
  const [boardState, setBoardState] = useState<BoardState>(new BoardState());
  const [dropSrc, setDropSrc] = useState<Piece | undefined>(undefined);

  const gridStyle = {
    aspectRatio: 11 / 9,
    maxWidth: 550,
  };

  const boardStyle = {
    borderRadius: '5px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
    maxWidth: 450,
    maxHeight: 450,
  };

  return (
    <Grid
      container
      columns={11}
      sx={gridStyle}
    >
      <Grid item xs={1}>
        <Captures
          boardState={boardState}
          player={OPPONENT}
          dropSrc={dropSrc}
          setDropSrc={setDropSrc}
        />
      </Grid>
      <Grid item xs={9} sx={boardStyle}>
        <Squares
          boardState={boardState}
          setBoardState={setBoardState}
          dropSrc={dropSrc}
          setDropSrc={setDropSrc}
        />
      </Grid>
      <Grid item xs={1}>
        <Captures
          boardState={boardState}
          player={PLAYER}
          dropSrc={dropSrc}
          setDropSrc={setDropSrc}
        />
      </Grid>
    </Grid>
  );
}
