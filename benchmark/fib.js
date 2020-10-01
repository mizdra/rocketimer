const fs = require('fs').promises;

(async () => {
  await fs.writeFile(
    'output.txt',
    `
fib(10) x 117 ops/sec ±0.77% (75 runs sampled)
fib(20) x 14,039 ops/sec ±0.69% (91 runs sampled)
  `.trim(),
  );
})();
