import { ReactNode } from "react";

const LIGHT_SQUARE_STYLE = { backgroundColor: '#F0D9B5'};
const DARK_SQUARE_STYLE = { backgroundColor: '#B58863' };

const LIGHT_HIGHLIGHTED_SQUARE_STYLE = { backgroundColor: '#FF0000' };
const DARK_HIGHLIGHTED_SQUARE_STYLE = { backgroundColor: '#800000' };

interface SquareProps {
  squareColor: 'white' | 'black';
  highlighted: boolean;
  boardWidth: number;
  onClick: () => void;
  children: ReactNode;
}

export function Square(props: SquareProps) {
  const {
    squareColor,
    highlighted,
    boardWidth,
    onClick,
    children
  } = props;

  const squareStyle = {
    ...(highlighted
      ? squareColor === 'white'
        ? LIGHT_HIGHLIGHTED_SQUARE_STYLE
        : DARK_HIGHLIGHTED_SQUARE_STYLE
      : squareColor === 'white'
        ? LIGHT_SQUARE_STYLE
        : DARK_SQUARE_STYLE)
  };

  const size = (width: number) => ({
    width: `${width / 9}px`,
    height: `${width / 9}px`,
  });

  const center = {
    display: 'flex',
    justifyContent: 'center',
  }

  return (
    <div
      style={{
        ...squareStyle,
        ...size(boardWidth),
        ...center,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}