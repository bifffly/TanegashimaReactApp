import { type ReactElement } from 'react';
import { Squares } from './Squares';
import { FenState, START_FEN_STRING } from '../../utils/FenUtils';

const BOARD_WIDTH = 450;

export function Board(): ReactElement {
  const fen = new FenState(START_FEN_STRING);

  const boardStyle = {
    borderRadius: '5px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
  };

  return (
    <div
      style={boardStyle}
    >
      <Squares
        fen={fen}
        boardWidth={BOARD_WIDTH}
      />
    </div>
  );
}
