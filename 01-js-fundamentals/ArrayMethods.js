import assert from 'node:assert/strict';
assert.equal(1 + 1, 2);
assert.deepEqual([1, 2], [1, 2]);
assert.throws(() => JSON.parse('x'));

