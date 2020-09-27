import React, { useState } from 'react';
import { perf, wait } from 'react-performance-testing';
import { render, fireEvent, screen } from '@testing-library/react';
import 'jest-performance-testing';

test('should measure re-render time when state is updated with multiple of the same component', async () => {
  const Counter = ({ testid }: { testid?: string }) => {
    const [count, setCount] = useState(0);
    return (
      <div>
        <p>{count}</p>
        <button data-testid={testid} type="button" onClick={() => setCount((c) => c + 1)}>
          count
        </button>
      </div>
    );
  };

  const Component = () => {
    return (
      <div>
        <Counter />
        <Counter testid="button" />
        <Counter />
      </div>
    );
  };

  const { renderTime } = perf<{ Counter: unknown[] }>(React);

  render(<Component />);

  fireEvent.click(screen.getByTestId('button'));

  await wait(() => {
    console.log(renderTime.current.Counter);
    expect(renderTime.current.Counter[0]).toBeUpdatedWithin(16);
    expect(renderTime.current.Counter[1]).toBeUpdatedWithin(16);
    expect(renderTime.current.Counter[2]).toBeUpdatedWithin(16);
  });
});
