import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest'
import Counter from './Counter';
import userEvent from '@testing-library/user-event'

test('Counter를 렌더한다', async () => {
  render(<Counter />);

  await userEvent.click(screen.getByRole('button', { name: "0" }))
  await userEvent.click(screen.getByRole('button', { name: "1" }))

  expect(screen.getByRole('button', { name: "2" })).toBeInTheDocument()
})