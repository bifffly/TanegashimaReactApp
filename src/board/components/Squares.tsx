import { Square } from './Square';

interface SquaresProps {
  boardWidth: number;
}

export function Squares(props: SquaresProps) {
  const { boardWidth } = props;

  return (
    <div>
      {[...Array(9)].map((_, r) => {
        return (
          <div
            key={r.toString()}
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              width: boardWidth
            }}
          >
            {[...Array(9)].map((_, c) => {
              const squareColor = c % 2 === r % 2 ? 'white' : 'black';

              return (
                <Square
                  key={`${c}${r}`}
                  squareColor={squareColor}
                  boardWidth={boardWidth}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}