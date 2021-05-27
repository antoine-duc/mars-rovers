import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders component', () => {
  render(<App />);
  const buttonElt = screen.getByRole('button');
  const inputElt = screen.getByRole('textbox');
  expect(buttonElt).toBeInTheDocument();
  expect(inputElt).toBeInTheDocument();
});

