import { render } from '@testing-library/react';
import { test } from 'vitest'
import Counter from './Counter';
import { queryTL } from '../siheom/queryTL';
import { expectTL } from '../siheom/expectTL';

test('Counter를 렌더한다', async () => {
  render(<Counter />);

  await queryTL.button("0").click();
  await queryTL.button("1").click();

  await expectTL(queryTL.button("2")).toBeVisible()
})