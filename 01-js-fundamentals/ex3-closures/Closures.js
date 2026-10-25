import assert  from "node:assert/strict";
import { setTimeout as sleep } from "node:timers/promises";

const makeCounter = (start=0) => {
  let count = start;
  const increment = () => {
    count += 1;
    return count;
  };

  const decrement = () => {
    count -= 1;
    return count;
  };

  const value = () => {
    return count;
  };

  return { increment, decrement, value };
};

// testing makeCounter
const counter = makeCounter();
assert.equal(counter.increment(), 1);
assert.equal(counter.increment(), 2);
assert.equal(counter.decrement(), 1);
assert.equal(counter.value(), 1);
assert.equal(counter.value(), 1);

assert.equal(makeCounter(10).increment(), 11);


const counterA = makeCounter();
const counterB = makeCounter();
counterA.increment();
counterA.increment();
assert.equal(counterA.value(), 2);
assert.equal(counterB.value(), 0);

assert.equal(counter.count, undefined);

counter.count = 100;

assert.equal(counter.value(), 1);

// once(fn)
const once = (fn) => {
  let hasRun = false;
  let result;

  return (...args) => {
    if (!hasRun) {
      result = fn(...args);
      hasRun = true;
    }
    return result;
  };
};

let calls = 0;
const init = (name) => {
  calls += 1;
  return `ready: ${name}`;
};

const initOnce = once(init);
assert.equal(initOnce('first'), 'ready: first');
assert.equal(initOnce('second'), 'ready: first');
assert.equal(initOnce(), 'ready: first');
assert.equal(calls, 1);

// debounce()
const debounce = (fn, waitMs) => {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
    }, waitMs);
  };
};

const WAIT_MS = 50;
const MARGIN_MS = 20;

const received = [];
const save = (text) => {
  received.push(text);
};

const debouncedSave = debounce(save, WAIT_MS);
debouncedSave('a');
debouncedSave('ab');
debouncedSave('abc');

assert.deepEqual(received, []);

await sleep(WAIT_MS + MARGIN_MS);

assert.deepEqual(received, ['abc']);

console.log('Exercise 3: all assertions passed');





