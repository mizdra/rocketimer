const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

function fib(n) {
  if (n <= 1) {
    return 1;
  }
  return fib(n - 2) + fib(n - 1);
}

suite
  .add('fib(10)', () => {
    fib(30);
  })
  .add('fib(20)', () => {
    fib(20);
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .run();
