import { type ReactElement } from 'react';
import { Box } from '@mui/material';
import { Squares } from './Squares';

export function Board(): ReactElement {
  const boardStyle = {
    borderRadius: '5px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
    maxWidth: 450,
  };

  return (
    <Box
      sx={boardStyle}
    >
      <Squares />
    </Box>
  );
}
