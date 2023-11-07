import { type ReactElement } from 'react';
import { Squares } from './Squares';

const BOARD_WIDTH = 450;

export function Board(): ReactElement {
  const boardStyle = {
    borderRadius: '5px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
  };

  return (
    <div
      style={boardStyle}
    >
      <Squares
        boardWidth={BOARD_WIDTH}
      />
    </div>
  );
}
