import { inspect } from 'util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(...args: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const format = (arg: any) => inspect(arg, { maxArrayLength: null, depth: null, colors: true });
  console.error(...args.map(format));
}
