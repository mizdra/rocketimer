import { inspect } from 'util';

export function log(...args: any[]) {
  const format = (arg: any) => inspect(arg, { maxArrayLength: null, depth: null, colors: true });
  console.log(...args.map(format));
}
