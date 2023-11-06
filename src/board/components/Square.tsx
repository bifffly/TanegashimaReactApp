const LIGHT_SQUARE_STYLE = { backgroundColor: '#F0D9B5'};
const DARK_SQUARE_STYLE = { backgroundColor: '#B58863' };

interface SquareProps {
  squareColor: 'white' | 'black';
  boardWidth: number;
}

export function Square(props: SquareProps) {
  const { squareColor, boardWidth } = props;

  const squareStyle = {
    ...(squareColor === 'white'
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
        ...center
      }}
    />
  );
}