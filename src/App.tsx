import type { ReactElement } from 'react';
import { Container } from '@mui/material';
import { Board } from './board/components/Board';
import './App.css';

export function App(): ReactElement {
  return (
    <Container>
      <Board />
    </Container>
  );
}
