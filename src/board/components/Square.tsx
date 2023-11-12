import {
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  Box, Grid,
} from '@mui/material';

const LIGHT_SQUARE_STYLE = {
  backgroundColor: '#F0D9B5',
};
const DARK_SQUARE_STYLE = {
  backgroundColor: '#B58863',
};

const LIGHT_HIGHLIGHTED_SQUARE_STYLE = {
  backgroundColor: '#FF0000',
};
const DARK_HIGHLIGHTED_SQUARE_STYLE = {
  backgroundColor: '#800000',
};

interface SquareProps {
  squareColor: 'white' | 'black'
  highlighted: boolean
  onClick: () => void
  children: ReactNode
}

export function Square(props: SquareProps): ReactElement {
  const {
    squareColor,
    highlighted,
    onClick,
    children,
  } = props;

  const squareStyle = {
    ...(highlighted
      ? squareColor === 'white'
        ? LIGHT_HIGHLIGHTED_SQUARE_STYLE
        : DARK_HIGHLIGHTED_SQUARE_STYLE
      : squareColor === 'white'
        ? LIGHT_SQUARE_STYLE
        : DARK_SQUARE_STYLE),
  };

  const size = {
    aspectRatio: '1',
  };

  const center = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <Grid
      item
      xs={1}
    >
      <Box
        sx={{
          ...squareStyle,
          ...size,
          ...center,
        }}
        onClick={onClick}
      >
        {children}
      </Box>
    </Grid>
  );
}
