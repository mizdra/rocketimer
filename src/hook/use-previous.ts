import { useEffect, useRef } from 'react';

/** 以前の値を返すHook */
export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
