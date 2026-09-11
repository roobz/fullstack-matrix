# Module 1: JavaScript fundamentals

Time: 3 weeks. Outcome: you can read and write everyday JavaScript, explain what happens when it runs, and write asynchronous code with `async/await` and `fetch` without guessing. Everything runs in Node. There is no browser, no framework, and no TypeScript yet.

Prerequisites: Module 0 complete. `node --version` prints v24 and `01-js-fundamentals/package.json` has `"type": "module"`.

## How to work through this module

- Each lesson has short examples. Type them into a scratch file and run them with `node Scratch.js`. Do not paste. Typing is slower and that is the point.
- `node --watch Scratch.js` reruns the file every time you save it.
- When a result surprises you, stop and find out why before moving on. Surprises are where the learning is.
- Do the exercises for a week at the end of that week. Each has a "Done when" line. Solutions are collapsed under each exercise. Open them only after you have a working version or have been stuck for more than thirty minutes.
- Commit after each exercise: `Module 1: exercise 3, closures`.
- Keep `notes/errors.md` open. Every error that costs you more than ten minutes goes in it.

## Contents

**Week 1: Values, functions, and control flow**
- [1.1 Running JavaScript](#11-running-javascript)
- [1.2 Values and types](#12-values-and-types)
- [1.3 Variables](#13-variables)
- [1.4 Operators, equality, and coercion](#14-operators-equality-and-coercion)
- [1.5 Control flow](#15-control-flow)
- [1.6 Functions](#16-functions)
- [1.7 Scope and closures](#17-scope-and-closures)
- [1.8 `this`](#18-this)

**Week 2: Data and modules**
- [2.1 Arrays](#21-arrays)
- [2.2 Objects](#22-objects)
- [2.3 Map and Set](#23-map-and-set)
- [2.4 Immutability](#24-immutability)
- [2.5 JSON](#25-json)
- [2.6 Modules](#26-modules)
- [2.7 Errors](#27-errors)
- [2.8 Classes, briefly](#28-classes-briefly)

**Week 3: Asynchronous JavaScript**
- [3.1 The event loop](#31-the-event-loop)
- [3.2 Callbacks](#32-callbacks)
- [3.3 Promises](#33-promises)
- [3.4 async/await](#34-asyncawait)
- [3.5 Promise combinators](#35-promise-combinators)
- [3.6 fetch](#36-fetch)
- [3.7 Cancellation and timeouts](#37-cancellation-and-timeouts)
- [3.8 Timers](#38-timers)

**Debugging**
- [Debugging skills](#debugging-skills)

**Exercises**
- [Exercise 1: Array methods by hand](#exercise-1-array-methods-by-hand)
- [Exercise 2: Word frequency](#exercise-2-word-frequency)
- [Exercise 3: Closures](#exercise-3-closures)
- [Exercise 4: Promise basics](#exercise-4-promise-basics)
- [Exercise 5: Parallel versus sequential](#exercise-5-parallel-versus-sequential)
- [Exercise 6: Timeout with AbortController](#exercise-6-timeout-with-abortcontroller)
- [Exercise 7: Event loop prediction](#exercise-7-event-loop-prediction)

[Glossary](#glossary) · [Self-check](#self-check) · [Resources](#resources)

---

# Week 1: Values, functions, and control flow

## 1.1 Running JavaScript

A JavaScript file is run top to bottom. Each statement ends with a semicolon. Comments are `//` to end of line or `/* ... */`.

```js
// Scratch.js
const greeting = 'Hello';
console.log(greeting, 'world'); // Hello world
```

```sh
node Scratch.js
node --watch Scratch.js    # reruns on save
node                       # REPL; Ctrl+D to exit
```

`console.log` accepts any number of arguments and prints them separated by spaces. It is your first debugging tool and you will replace it with a real debugger later in this module.

## 1.2 Values and types

JavaScript has eight types. Seven are **primitives**: a primitive is a single value that cannot be changed in place. The eighth is **object**, which covers everything else: plain objects, arrays, functions, dates, and so on.

| Type | Examples | Notes |
|---|---|---|
| `string` | `'text'`, `"text"`, `` `text` `` | Immutable. Use single quotes in this course, backticks for templates. |
| `number` | `42`, `3.14`, `-0`, `NaN`, `Infinity` | One numeric type. 64-bit floating point. |
| `boolean` | `true`, `false` | |
| `undefined` | `undefined` | "No value was assigned." The default for missing things. |
| `null` | `null` | "Deliberately empty." You set it on purpose. |
| `bigint` | `9007199254740993n` | Integers beyond `Number.MAX_SAFE_INTEGER`. Rare. |
| `symbol` | `Symbol('id')` | Unique keys. Rare in application code. |
| `object` | `{}`, `[]`, `() => {}`, `new Date()` | Reference type. See 2.2. |

`typeof` returns the type name as a string:

```js
typeof 'a';        // 'string'
typeof 1;          // 'number'
typeof undefined;  // 'undefined'
typeof {};         // 'object'
typeof [];         // 'object'   (arrays are objects; use Array.isArray)
typeof null;       // 'object'   (a bug from 1995 that can never be fixed)
typeof (() => {}); // 'function' (functions are objects, but typeof reports them separately)
```

### Numbers

JavaScript stores every number in one 64-bit binary format, the same format most languages call a "double." Binary cannot write most decimal fractions exactly, in the same way that decimal cannot write one third exactly (0.333... goes on forever). So `0.1` is stored as a value very slightly different from one tenth, and arithmetic on such values produces tiny errors. Two consequences:

```js
0.1 + 0.2;                 // 0.30000000000000004
0.1 + 0.2 === 0.3;         // false
Number.MAX_SAFE_INTEGER;   // 9007199254740991; integers above this lose precision
```

Because of this, two rules:

**Rule 1: Store money as whole cents, not as dollars with a decimal point.** A price of $10.10 is stored as the integer `1010`. Whole numbers below `Number.MAX_SAFE_INTEGER` are exact, so adding, subtracting, and multiplying them by other whole numbers never produces a rounding error. Convert to dollars only when displaying the value.

```js
const priceInCents = 1010;
const quantity = 3;
const totalInCents = priceInCents * quantity;            // 3030, exact
const CENTS_PER_DOLLAR = 100;
const display = `$${(totalInCents / CENTS_PER_DOLLAR).toFixed(2)}`;   // '$30.30'

// Compare with the decimal approach:
const priceInDollars = 10.10;
priceInDollars * quantity;                               // 30.299999999999997
```

Not every decimal calculation goes wrong. `19.99 * 3` happens to print `59.97`. The problem is that you cannot tell in advance which ones will, so the safe choice is to avoid decimals for money altogether.

**Rule 2: When you must check whether two calculated decimals are equal, check whether they are close enough, not whether they are identical.** Since `0.1 + 0.2` is not exactly `0.3`, `0.1 + 0.2 === 0.3` is `false` even though it is mathematically true. Instead, subtract one from the other and check that the difference is smaller than some very small number. `Number.EPSILON` is the built-in constant for the smallest meaningful difference between two numbers near 1.

```js
const isCloseEnough = (a, b) => Math.abs(a - b) < Number.EPSILON;
isCloseEnough(0.1 + 0.2, 0.3);   // true
```

Rule 2 applies to any decimal arithmetic: percentages, averages, measurements. Rule 1 avoids the problem entirely for money, which is why it is preferred there.

`NaN` (not a number) results from failed numeric operations. It is the only value not equal to itself, so check for it with `Number.isNaN`:

```js
Number('abc');             // NaN
NaN === NaN;               // false
Number.isNaN(Number('abc')); // true
```

Conversion: `Number('42')` gives `42`. `Number('')` gives `0`. `parseInt('42px', 10)` gives `42`. Prefer `Number` and check the result with `Number.isNaN` or `Number.isFinite`.

### Strings

Strings are immutable. Methods return new strings.

```js
const title = 'JavaScript Fundamentals';
title.length;                 // 22
title.toUpperCase();          // 'JAVASCRIPT FUNDAMENTALS'
title.includes('Script');     // true
title.startsWith('Java');     // true
title.slice(0, 10);           // 'JavaScript'
title.split(' ');             // ['JavaScript', 'Fundamentals']
title.replaceAll('a', '@');   // 'J@v@Script Fund@ment@ls'
title.trim();                 // removes surrounding whitespace
title.padEnd(30, '.');        // pads to length 30
title[0];                     // 'J'
title.at(-1);                 // 's'
```

Template literals use backticks and `${}` for interpolation, and may span lines:

```js
const count = 3;
const message = `You have ${count} item${count === 1 ? '' : 's'}.`;
```

### `undefined` versus `null`

`undefined` is what you get when nothing was assigned: a missing property, a function with no `return`, an unpassed parameter. `null` is a value you assign to say "empty on purpose." Both are falsy. In this course, functions that may have no result return `undefined` (by returning nothing) or `null` consistently; pick one per function and say so in its comment.

## 1.3 Variables

```js
const limit = 10;      // cannot be reassigned
let count = 0;         // can be reassigned
count += 1;
// var total = 0;      // never use var
```

Rules for this course:

- `const` by default. It says "this name always refers to this value," which is one less thing to track when reading.
- `let` only when you will reassign. A `let` that is never reassigned is a lie to the reader.
- Never `var`. A `var` is visible throughout the entire function it appears in, not just the `{}` block around it, and it can be read on lines above its declaration (where its value is `undefined` instead of an error). Both behaviors let mistakes go unnoticed. `let` and `const` turn those mistakes into immediate errors.

`const` prevents reassignment of the name, not mutation of the value:

```js
const items = [];
items.push(1);     // fine; the array changed, the binding did not
items = [1];       // TypeError: Assignment to constant variable
```

**Block scope.** `let` and `const` exist only inside the nearest `{}`:

```js
if (true) {
  const inner = 1;
}
console.log(inner);  // ReferenceError: inner is not defined
```

**Naming.** `camelCase` for variables and functions. `UPPER_SNAKE_CASE` for constants that are fixed configuration values (`MAX_RETRIES`, `BASE_URL`). `PascalCase` for classes. Names describe what the value is, not its type: `stories`, not `storyArray`.

**No unexplained numbers.** A reader who meets `86400` in the middle of a calculation has to stop and work out what it means. `const SECONDS_PER_DAY = 86400;` tells them. Give every fixed number a name that says what it is. (Code reviewers call an unexplained literal a "magic number"; you will see that term in ESLint rule names.)

## 1.4 Operators, equality, and coercion

**Coercion** is automatic type conversion. JavaScript does a lot of it, and most of it is a source of bugs.

```js
1 + '1';        // '11'   + concatenates if either side is a string
'3' * '4';      // 12     * only means multiply, so both convert to numbers
true + 1;       // 2
[] + {};        // '[object Object]'
'5' == 5;       // true   == converts before comparing
'5' === 5;      // false  === compares type and value
null == undefined;   // true
null === undefined;  // false
```

Rule: **always `===` and `!==`**. There is exactly one common case where people use `==`, checking for `null` or `undefined` at once, and `value == null` does that. Even then, prefer `value === null || value === undefined`, or the operators below.

### Truthy and falsy

In a boolean context (`if`, `!`, `&&`, `||`), every value converts to `true` or `false`. Exactly these are **falsy**:

```js
false, 0, -0, 0n, '', null, undefined, NaN
```

Everything else is truthy, including `'0'`, `'false'`, `[]`, and `{}`. That last pair surprises people: an empty array is truthy. To test for an empty array, check `items.length === 0`.

### Logical operators return values, not booleans

```js
'a' && 'b';      // 'b'   returns the first falsy value, or the last value
'' && 'b';       // ''
'a' || 'b';      // 'a'   returns the first truthy value, or the last value
'' || 'b';       // 'b'
!'a';            // false
!!'a';           // true  (convert to boolean; Boolean('a') is clearer)
```

### `??` and `?.`

Nullish coalescing `??` returns the right side only when the left is `null` or `undefined`. Compare with `||`, which also replaces `0`, `''`, and `false`:

```js
const port = config.port ?? 3000;   // keeps 0 if config.port is 0
const port2 = config.port || 3000;  // replaces 0 with 3000, probably a bug
```

Optional chaining `?.` stops and returns `undefined` if the left side is `null` or `undefined`, instead of throwing:

```js
const city = user?.address?.city;       // undefined if user or address is missing
const first = stories?.[0];             // for index access
const result = callback?.();            // for calling a function that may be absent
```

### Ternary

```js
const label = count === 1 ? 'item' : 'items';
```

Use it for choosing between two values. Do not nest one ternary inside another. For three or more choices, use `if` / `else if`, or an object whose keys are the possible inputs and whose values are the results:

```js
const LABELS = { idle: 'Waiting', loading: 'Loading...', error: 'Failed' };
const label = LABELS[status] ?? 'Unknown';
```

### Arithmetic and assignment

`+ - * / % **`, and compound forms `+= -= *= /=`. `%` is remainder (sign follows the left operand). `**` is exponent. Increment with `count += 1`, not `count++`; the compound form is clearer about what happens and ESLint will enforce it in Module 3.

## 1.5 Control flow

```js
if (score >= PASSING_SCORE) {
  status = 'pass';
} else if (score >= RETRY_SCORE) {
  status = 'retry';
} else {
  status = 'fail';
}
```

Always use braces, even for a one-line body. Lines get added later.

### `switch`

```js
switch (status) {
  case 'idle':
    return 'Waiting';
  case 'loading':
    return 'Loading...';
  case 'error':
    return 'Something went wrong';
  default:
    throw new Error(`Unknown status: ${status}`);
}
```

Every `switch` gets a `default`. In Module 4, TypeScript will use it to prove you handled every case. A `case` without `return` or `break` falls through into the next one; this is almost always a bug.

### Loops

```js
for (const story of stories) {          // each value, in order; works on arrays, strings, Map, Set
  console.log(story.title);
}

for (const [index, story] of stories.entries()) {   // when you need the index too
  console.log(index, story.title);
}

for (let i = 0; i < 10; i += 1) {       // counting; fine when you need the number
  console.log(i);
}

while (queue.length > 0) {              // until a condition changes
  process(queue.shift());
}
```

`break` exits the loop. `continue` skips to the next iteration. Do not use `for...in` on arrays; it iterates keys as strings and includes inherited properties. For objects, use `Object.entries` (2.2). Most loops over arrays are better expressed with `map`, `filter`, and friends (2.1).

## 1.6 Functions

A function is a reusable block with inputs (parameters) and one output (the return value). There are three ways to write one:

```js
// Declaration. Hoisted: usable before the line it appears on.
function add(a, b) {
  return a + b;
}

// Expression assigned to a const. Not hoisted.
const add2 = function (a, b) {
  return a + b;
};

// Arrow function. Shortest, no own `this` (1.8). The default in this course.
const add3 = (a, b) => {
  return a + b;
};

// Arrow with an expression body: the expression is returned.
const add4 = (a, b) => a + b;
```

Returning an object literal from an expression body needs parentheses, or the braces are read as a block:

```js
const makePoint = (x, y) => ({ x, y });
```

A function without a `return` returns `undefined`.

### Parameters

```js
const greet = (name, greeting = 'Hello') => `${greeting}, ${name}`;   // default value
greet('Ada');              // 'Hello, Ada'
greet('Ada', 'Welcome');   // 'Welcome, Ada'
greet();                   // 'Hello, undefined'  (missing arguments are undefined)

const sum = (...numbers) => numbers.reduce((total, n) => total + n, 0);   // rest parameter
sum(1, 2, 3);              // 6

const values = [1, 2, 3];
sum(...values);            // 6, spread at the call site
```

More than two or three positional parameters is hard to read at the call site. Take an object instead and destructure it (2.2):

```js
const createStory = ({ title, url, score = 0 }) => ({ title, url, score });
createStory({ title: 'A', url: 'https://a.example' });
```

### Functions are values

You can store a function in a variable, put it in an array, pass it to another function, and return it from one. A function that takes or returns a function is a **higher-order function**. A function passed to another to be called later is a **callback**.

```js
const twice = (fn, value) => fn(fn(value));
const increment = (n) => n + 1;
twice(increment, 5);       // 7

[3, 1, 2].sort((a, b) => a - b);   // the comparison function is a callback
```

### Pure functions

A **pure function** returns the same output for the same inputs and changes nothing outside itself: no mutation of arguments, no global writes, no I/O. Pure functions are easy to test and reason about. Most of your code should be pure functions, with impure parts (file reads, network, printing) kept at the edges. This idea returns in every later module.

```js
// Pure
const addTax = (price, rate) => price * (1 + rate);

// Impure: depends on and mutates outside state
let total = 0;
const addToTotal = (price) => { total += price; };
```

## 1.7 Scope and closures

**Scope** is the set of names visible at a point in the code. In JavaScript, what is visible from a given line is determined by where that line sits in the file (which blocks and functions surround it), not by which function happened to call it. This is called lexical scope. Inner blocks see outer names; outer blocks do not see inner names.

```js
const outer = 'outer';
const show = () => {
  const inner = 'inner';
  console.log(outer, inner);   // both visible
};
show();
console.log(inner);            // ReferenceError
```

A **closure** is a function together with the variables it could see when it was created. When a function is returned or passed somewhere else, it keeps access to those variables even after the enclosing function has finished.

```js
const makeCounter = () => {
  let count = 0;                      // lives on after makeCounter returns
  return () => {
    count += 1;
    return count;
  };
};

const counterA = makeCounter();
const counterB = makeCounter();
counterA();   // 1
counterA();   // 2
counterB();   // 1   separate closure, separate count
```

Each call to `makeCounter` creates a fresh `count`. The returned function keeps a reference to that one. Nothing outside can read or change `count` except by calling the function. This is how JavaScript gives a function private, remembered state without using a class. The same mechanism is behind `debounce` and `once` (Exercise 3), caching a function's results, event handlers that remember the element they were attached to, and React hooks in Module 6.

### The classic loop bug

```js
for (var i = 0; i < 3; i += 1) {
  setTimeout(() => console.log(i), 0);    // 3, 3, 3
}
for (let i = 0; i < 3; i += 1) {
  setTimeout(() => console.log(i), 0);    // 0, 1, 2
}
```

`var` makes one `i` shared by every iteration; by the time the callbacks run, it is `3`. `let` creates a new `i` per iteration, and each closure captures its own. This is the practical reason `var` is banned.

## 1.8 `this`

Inside a regular function, `this` is determined by **how the function is called**, not where it was written:

```js
const story = {
  title: 'Closures',
  describe() {
    return `Story: ${this.title}`;
  },
};
story.describe();              // 'Story: Closures'   called as a method, this = story

const detached = story.describe;
detached();                    // TypeError: Cannot read properties of undefined (reading 'title')
                               // called as a plain function in a module, this = undefined
```

Arrow functions do not have their own `this`. They use the `this` of the surrounding code, exactly like any other variable. This is why arrows are the right choice for callbacks inside methods:

```js
const feed = {
  prefix: '>',
  titles: ['A', 'B'],
  print() {
    this.titles.forEach((title) => console.log(this.prefix, title));   // this = feed, works
  },
};
```

With a regular `function` callback there, `this` would be `undefined` and the code would throw.

Practical rule for this course: use arrow functions everywhere except for methods defined with the shorthand syntax in object literals and classes, where you want `this` to be the object. `call`, `apply`, and `bind` exist to set `this` explicitly; you will read them in older code and rarely write them.

---

# Week 2: Data and modules

## 2.1 Arrays

An array is an ordered list. Indexes start at 0. Arrays can hold any mix of types, but in practice, and always in TypeScript, keep one type per array.

```js
const scores = [10, 20, 30];
scores.length;        // 3
scores[0];            // 10
scores.at(-1);        // 30
scores[99];           // undefined, no error
Array.isArray(scores); // true
```

### Mutating versus non-mutating methods

This distinction matters for the whole course. **Mutating** methods change the array in place. **Non-mutating** methods return a new array and leave the original alone. React and Zustand both depend on you producing new arrays.

| Mutating (avoid unless the array is local to a function) | Non-mutating (prefer) |
|---|---|
| `push`, `pop`, `shift`, `unshift` | `concat`, `[...arr, item]` |
| `splice` | `slice`, `toSpliced` |
| `sort` | `toSorted` |
| `reverse` | `toReversed` |
| `arr[i] = x` | `with(i, x)` |
| `fill`, `copyWithin` | `map`, `filter`, `flat`, `flatMap` |

`sort` has two traps: it mutates, and with no comparator it sorts as strings, so `[10, 9, 1].sort()` gives `[1, 10, 9]`. Always pass a comparator and use `toSorted`:

```js
const byScoreDesc = stories.toSorted((a, b) => b.score - a.score);
const byTitle = stories.toSorted((a, b) => a.title.localeCompare(b.title));
```

### Iteration methods

Each takes a callback and calls it once per element with `(element, index, array)`.

```js
const stories = [
  { title: 'A', score: 120, tags: ['js'] },
  { title: 'B', score: 40, tags: ['ts', 'js'] },
  { title: 'C', score: 300, tags: [] },
];

stories.map((s) => s.title);                          // ['A', 'B', 'C']   transform each
stories.filter((s) => s.score > 100);                 // [A, C]            keep some
stories.find((s) => s.score > 100);                   // A                 first match or undefined
stories.findIndex((s) => s.title === 'C');            // 2                 or -1
stories.some((s) => s.score > 200);                   // true              any?
stories.every((s) => s.score > 0);                    // true              all?
stories.flatMap((s) => s.tags);                       // ['js', 'ts', 'js'] map then flatten one level
stories.reduce((total, s) => total + s.score, 0);     // 460               combine everything into one value
['js', 'ts'].includes('ts');                          // true
stories.forEach((s) => console.log(s.title));         // side effects only; returns undefined
```

`reduce` takes two things: a function of the form `(runningResult, element) => newRunningResult`, and a starting value for the running result. It calls the function once per element, feeding each call the result of the previous one, and returns the final result. In the example above the running result starts at `0` and each call adds one story's score. Always pass the starting value. `reduce` can build any shape, but if a `map` or `filter` says the same thing, use that instead; `reduce` is harder to read.

```js
const byTitle = stories.reduce((index, s) => {
  index[s.title] = s;
  return index;
}, {});
// Or, for grouping into arrays, Object.groupBy(stories, (s) => s.tags[0] ?? 'none')
```

### Creating and destructuring

```js
Array.from({ length: 3 }, (_, i) => i * 2);   // [0, 2, 4]
[...'abc'];                                   // ['a', 'b', 'c']   spread any iterable
const [first, second, ...rest] = [1, 2, 3, 4]; // first=1, second=2, rest=[3, 4]
const [, , third] = [1, 2, 3];                // skip positions
```

Chaining reads top to bottom as a pipeline:

```js
const topTitles = stories
  .filter((s) => s.score > 50)
  .toSorted((a, b) => b.score - a.score)
  .map((s) => s.title);
```

## 2.2 Objects

An object is a collection of key-value pairs. Keys are strings (or symbols). Values are anything.

```js
const story = {
  title: 'Closures',
  score: 42,
  'has-space': true,          // quote keys that are not valid identifiers
  author: { name: 'Ada' },    // nested
  describe() {                // method shorthand
    return `${this.title} (${this.score})`;
  },
};

story.title;              // 'Closures'
story['has-space'];       // true
story.missing;            // undefined
const key = 'score';
story[key];               // 42     computed access

const title = 'Dynamic';
const shorthand = { title };          // { title: 'Dynamic' }  same as { title: title }
const computed = { [key]: 1 };        // { score: 1 }
```

### Reference semantics

Primitives are copied by value. Objects (including arrays) are handled by **reference**: a variable holds a pointer to the object, and assignment copies the pointer, not the object.

```js
const a = { count: 1 };
const b = a;
b.count = 2;
a.count;          // 2   same object
a === b;          // true
{ count: 2 } === { count: 2 };   // false   different objects, even with the same contents
```

Consequences: passing an object to a function passes the reference, so the function can mutate the caller's object. Comparing two objects with `===` asks "are these the same object?", not "do these have the same contents?". To compare contents, compare the fields, or use `node:assert`'s `deepStrictEqual` in tests.

### Reading and writing

```js
Object.keys(story);      // ['title', 'score', 'has-space', 'author', 'describe']
Object.values(story);    // the values
Object.entries(story);   // [['title', 'Closures'], ...]
Object.fromEntries([['a', 1], ['b', 2]]);   // { a: 1, b: 2 }
'title' in story;        // true
Object.hasOwn(story, 'title');   // true; the safe way to check for own properties

for (const [key, value] of Object.entries(story)) {
  console.log(key, value);
}
```

### Destructuring and spread

```js
const { title, score, missing = 'default', author: { name } } = story;
// title='Closures', score=42, missing='default', name='Ada'
const { title: storyTitle } = story;    // rename: storyTitle='Closures'

const updated = { ...story, score: 43 };           // shallow copy with one change
const { describe, ...data } = story;              // everything except describe
const merged = { ...defaults, ...userSettings };  // later spreads win
```

### Shallow versus deep copy

Spread and `Object.assign` copy one level. Nested objects are still shared:

```js
const copy = { ...story };
copy.author.name = 'Grace';
story.author.name;        // 'Grace'   the nested object was shared
```

For a full copy of plain data, use `structuredClone(story)`. It handles nesting, dates, maps, and sets. It does not copy functions and will throw if it meets one.

### Deleting and freezing

`delete obj.key` removes a property. Prefer building a new object without the key using destructuring and rest, as above. `Object.freeze(obj)` makes the top level read-only (silently ignored in non-strict code, throws in modules). It is shallow.

## 2.3 Map and Set

A `Map` is a collection of key-value pairs where keys can be any value, not just strings, and insertion order is preserved. A `Set` is a collection of unique values.

```js
const counts = new Map();
counts.set('js', 1);
counts.set('js', (counts.get('js') ?? 0) + 1);   // 2
counts.has('ts');           // false
counts.get('ts');           // undefined
counts.size;                // 1
counts.delete('js');
for (const [word, count] of counts) { /* ... */ }
[...counts.entries()];      // to array for sorting

const seen = new Set([1, 2, 2, 3]);   // Set {1, 2, 3}
seen.add(4);
seen.has(2);                // true
[...seen];                  // [1, 2, 3, 4]
const unique = [...new Set(items)];   // remove duplicate values from an array
```

Use a `Map` instead of a plain object when the keys are not known in advance (a counter keyed by words from a file), when keys are not strings, or when you need `size` and reliable ordering. Use an object when the keys are a fixed, known shape (a story with `title` and `score`). Neither serializes to JSON directly; convert with `Object.fromEntries(map)` or `[...set]` first.

`WeakMap` and `WeakSet` also exist. They solve a specific memory-management problem that does not come up in this course.

## 2.4 Immutability

Treat data as read-only. To change something, make a new value with the change applied:

```js
// Instead of: story.score += 1;
const upvoted = { ...story, score: story.score + 1 };

// Instead of: stories.push(newStory);
const withNew = [...stories, newStory];

// Instead of: stories[2].title = 'X';
const renamed = stories.map((s, i) => (i === 2 ? { ...s, title: 'X' } : s));

// Instead of: stories.splice(index, 1);
const without = stories.filter((s) => s.id !== id);
```

Why: a function that mutates its input has an effect the caller may not expect, and bugs from that are hard to find because the change happened far from where it was noticed. Immutable updates also make change detection trivial (`before !== after`), which is exactly how React decides what to re-render. It costs a little allocation, which does not matter at application scale.

## 2.5 JSON

JSON (JavaScript Object Notation) is a text format for data. It looks like JavaScript object syntax with strict rules: keys are double-quoted strings, no trailing commas, no comments, no functions, no `undefined`.

```js
const text = JSON.stringify({ title: 'A', score: 1, tags: ['js'] });
// '{"title":"A","score":1,"tags":["js"]}'
JSON.stringify(value, null, 2);     // pretty-printed with 2-space indent

const data = JSON.parse('{"title":"A"}');   // { title: 'A' }
JSON.parse('not json');                     // SyntaxError: Unexpected token
```

What does not survive a round trip:

| Value | After `stringify` |
|---|---|
| `undefined` property | dropped |
| `undefined` in an array | `null` |
| function | dropped |
| `Date` | ISO string; comes back as a string, not a `Date` |
| `Map`, `Set` | `{}` |
| `NaN`, `Infinity` | `null` |
| `bigint` | throws |

Always wrap `JSON.parse` of external input in `try/catch`. Never trust that parsed data has the shape you expect; Module 4 adds Zod to check it.

## 2.6 Modules

A module is a file with its own scope. Nothing inside is visible to other files unless exported. This is the unit of code organization for the whole course.

```js
// Math.js
export const add = (a, b) => a + b;
export const PI = 3.14159;
const helper = () => {};          // not exported; private to this file

// Main.js
import { add, PI } from './Math.js';      // named imports; the .js extension is required in Node
import * as math from './Math.js';        // everything the file exports, under one name: math.add
import { readFile } from 'node:fs/promises';   // built-in; always use the node: prefix
import { z } from 'zod';                  // an installed package, by name
```

Default exports exist (`export default fn` and `import fn from './X.js'`). This course uses named exports only. Named exports are checked by the editor, rename safely, and keep one name for one thing across files.

Rules:

- `"type": "module"` in `package.json` makes `.js` files modules. Without it Node uses the older CommonJS system (`require`), which you will see in older code and some packages.
- All imports in a file are processed before any other line in that file runs, no matter where they are written. Put them at the top so the file reads the way it executes.
- Relative imports start with `./` or `../` and include the extension.
- A module runs once, the first time anything imports it, no matter how many files import it. Every importer gets the same exported values. A variable at the top level of a module is therefore one shared copy for the whole program. That is convenient for configuration that everything should agree on, and a source of confusing bugs when two files change the same shared value without knowing about each other.
- Top-level `await` is allowed in modules. A module's `main` function can be called with `await main();` at the bottom of the file.

## 2.7 Errors

An error is an object describing something that went wrong. `throw` stops the current function immediately, then stops the function that called it, and so on outward, until it reaches a `try/catch` that catches it. If nothing catches it, the process prints the stack trace and exits.

```js
const parseScore = (text) => {
  const score = Number(text);
  if (Number.isNaN(score)) {
    throw new Error(`Invalid score: "${text}"`);
  }
  return score;
};

try {
  const score = parseScore('abc');
} catch (error) {
  console.error(error.message);   // Invalid score: "abc"
  console.error(error.stack);     // message plus where it happened
} finally {
  // runs whether or not there was an error: close files, clear timers
}
```

Rules:

- Throw `Error` objects, never strings or plain objects. Only `Error` carries a stack trace.
- Messages say what was wrong and include the offending value.
- Wrap a low-level error with context using `cause`: `throw new Error('Could not load config', { cause: error })`. The original stays attached for debugging.
- Catch where you can do something useful: retry, fall back, report to the user. Do not catch just to log and rethrow at every level.
- An empty `catch {}` hides bugs. If you truly intend to ignore an error, comment why.

Custom error types let callers tell errors apart:

```js
export class NotFoundError extends Error {
  constructor(what) {
    super(`${what} was not found`);
    this.name = 'NotFoundError';
  }
}

try {
  findStory(id);
} catch (error) {
  if (error instanceof NotFoundError) { /* handle */ } else { throw error; }
}
```

Module 5 covers when to throw versus when to return a result object.

## 2.8 Classes, briefly

A class is a template for objects that share methods. Module 5 covers classes and design in depth. For now, recognize the syntax:

```js
class Counter {
  count = 0;                   // field with a default

  constructor(start = 0) {     // runs on `new`
    this.count = start;
  }

  increment() {                // method; this = the instance
    this.count += 1;
    return this.count;
  }

  static fromString(text) {    // called on the class, not an instance
    return new Counter(Number(text));
  }
}

const counter = new Counter(5);
counter.increment();           // 6
counter instanceof Counter;    // true
Counter.fromString('3');
```

`extends` and `super` give inheritance. Underneath, JavaScript uses **prototypes**: each object has a hidden link to another object where property lookups continue when the property is not found on the object itself. A class's methods live on the prototype that its instances link to. You need to know this exists to understand `instanceof` and some error messages. You do not need to work with prototypes directly.

Compare `Counter` with `makeCounter` from 1.7. Both give you independent counters with private-ish state. The closure version cannot be inspected or mutated from outside; the class version can (`counter.count = 100`). Module 5 discusses when each is the better fit.

---

# Week 3: Asynchronous JavaScript

## 3.1 The event loop

JavaScript runs on one thread. One statement executes at a time. There is no way for two pieces of your JavaScript to run at the same moment. Yet a program can wait for a network response without freezing. The mechanism is the **event loop**.

The pieces:

- **The call stack.** The functions currently executing. When it empties, the current task is done.
- **The runtime's background workers.** Node hands slow operations (a file read, a network request, a timer) to the operating system or to helper threads inside Node itself, then carries on. Your JavaScript is not running while it waits.
- **The task queue** (also called the macrotask queue). When a background operation finishes, the callback you gave it is placed here. Timers land here too.
- **The microtask queue.** Callbacks passed to `.then`, the code that follows an `await`, and functions passed to `queueMicrotask` land here.

The loop: run the current task until the stack is empty. Then run **every** item in the microtask queue until it is empty, including items added to it by microtasks that just ran. Then take **one** task from the task queue and repeat.

```js
console.log('1');
setTimeout(() => console.log('4'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('2');
// Output: 1 2 3 4
```

`1` and `2` are the current task. `3` is a microtask, so it runs as soon as the stack is empty, before any timer. `4` is a task and waits its turn even at 0 ms.

Consequences:

- A long synchronous loop blocks everything, including timers and I/O callbacks. "The UI froze" in a browser is exactly this.
- `setTimeout(fn, 0)` means "run `fn` in a later task," not "run now."
- A timer fires no earlier than requested. It may fire later if the stack is busy.
- Asynchronous does not mean parallel. Your callbacks still run one at a time. The waiting happens elsewhere.

## 3.2 Callbacks

The original way to handle "call this when done":

```js
setTimeout(() => {
  console.log('one second later');
}, 1000);

import { readFile } from 'node:fs';
readFile('data.txt', 'utf8', (error, text) => {     // Node's error-first convention
  if (error) {
    console.error(error);
    return;
  }
  console.log(text);
});
```

The problem appears when steps depend on each other:

```js
readFile('a.txt', 'utf8', (errA, a) => {
  if (errA) return handle(errA);
  readFile(a.trim(), 'utf8', (errB, b) => {
    if (errB) return handle(errB);
    readFile(b.trim(), 'utf8', (errC, c) => {
      // three levels deep, error handling repeated, hard to follow
    });
  });
});
```

Callbacks are still how timers and event listeners work, and you pass callbacks to array methods constantly. For sequences of asynchronous steps, promises replaced them.

## 3.3 Promises

A **promise** is an object representing a value that is not available yet. It is in one of three states: **pending**, **fulfilled** with a value, or **rejected** with a reason (an error). Once fulfilled or rejected it is **settled** and never changes.

```js
const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

delay(1000)
  .then(() => {
    console.log('one second');
    return delay(1000);          // returning a promise makes the chain wait for it
  })
  .then(() => {
    console.log('two seconds');
    return 42;                   // returning a value passes it to the next then
  })
  .then((value) => {
    console.log(value);          // 42
    throw new Error('oops');     // throwing rejects the chain
  })
  .catch((error) => {
    console.error(error.message);   // oops   one catch handles any rejection above it
  })
  .finally(() => {
    console.log('done either way');
  });
```

Points to understand:

- `then` returns a new promise, which is why chaining works.
- An error anywhere in the chain skips to the next `catch`. This is what removes the repeated `if (error)` from the callback version.
- A rejected promise with no `catch` becomes an **unhandled rejection**, which crashes a Node process. Every chain needs a `catch` at its end, or the equivalent `try/catch` around an `await`.
- `Promise.resolve(value)` and `Promise.reject(error)` create already-settled promises. Useful in tests.

You need to read promise chains fluently because library code and older codebases use them. You will write almost none, because of the next section.

## 3.4 async/await

`async/await` is syntax over promises. An `async` function always returns a promise. Inside it, `await` pauses the function until a promise settles, then gives you the fulfilled value or throws the rejection reason. While paused, other tasks run; nothing is blocked.

```js
const loadTwo = async () => {
  try {
    await delay(1000);
    console.log('one second');
    await delay(1000);
    console.log('two seconds');
    return 42;
  } catch (error) {
    console.error(error.message);
    throw error;                 // rethrow if the caller needs to know
  } finally {
    console.log('done either way');
  }
};

const value = await loadTwo();   // top-level await works in modules
```

Same behavior as the chain in 3.3, and it reads like synchronous code. This is how you write asynchronous JavaScript in this course.

### Mistakes everyone makes once

**Forgetting `await`.** The function continues immediately with a promise object instead of the value. `no-floating-promises` in Module 4 catches this.

```js
const text = readFile('a.txt', 'utf8');   // text is a Promise, not a string
const text2 = await readFile('a.txt', 'utf8');   // text2 is the string
```

**`await` inside `forEach`.** `forEach` ignores the returned promises and does not wait. Use `for...of` for sequential work, or `Promise.all` with `map` for parallel work.

```js
ids.forEach(async (id) => { await save(id); });   // returns before any save finishes
for (const id of ids) { await save(id); }         // one after another
await Promise.all(ids.map((id) => save(id)));     // all at once
```

**Sequential when parallel was intended.** Two independent `await`s in a row run one after the other. If they do not depend on each other, start both first:

```js
const a = await fetchA();        // 1 second
const b = await fetchB();        // then 1 more second
const [a2, b2] = await Promise.all([fetchA(), fetchB()]);   // 1 second total
```

**Catching and swallowing.** An empty `catch` in an async function turns a failure into `undefined` and the bug moves somewhere else.

`return await promise` inside a `try` block is needed so the `catch` sees the rejection; a bare `return promise` hands the promise to the caller unexamined.

## 3.5 Promise combinators

Given several promises:

| Combinator | Resolves when | Rejects when | Use it for |
|---|---|---|---|
| `Promise.all(list)` | all fulfill, with an array of values in order | any rejects, immediately | independent work where one failure fails the whole operation |
| `Promise.allSettled(list)` | all settle, with `{ status, value }` or `{ status, reason }` each | never | independent work where you want every result, including failures |
| `Promise.race(list)` | the first settles, with its value | the first settles, with its reason | timeouts (race a request against a delay) |
| `Promise.any(list)` | the first fulfills | all reject, with an `AggregateError` | trying several sources, first success wins |

```js
const results = await Promise.allSettled(ids.map(fetchStory));
const stories = results
  .filter((r) => r.status === 'fulfilled')
  .map((r) => r.value);
const failures = results.filter((r) => r.status === 'rejected');
```

## 3.6 fetch

`fetch(url, options)` makes an HTTP request and returns a promise for a `Response`. The same API exists in browsers and Node.

```js
const response = await fetch('https://hacker-news.firebaseio.com/v0/item/1.json');
response.ok;           // true for status 200 to 299
response.status;       // 200
response.headers.get('content-type');
const data = await response.json();    // parses the body; also a promise
```

Two separate kinds of failure, and `fetch` treats them differently:

1. **Network failure.** DNS fails, the connection is refused, the request is aborted. `fetch` **rejects**. Your `await` throws.
2. **HTTP error.** The server responded with 404 or 500. `fetch` **fulfills**. `response.ok` is `false`. Nothing throws unless you make it.

Because of the second case, every project has a helper like this:

```js
const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} for ${url}`);
  }
  return response.json();
};
```

Sending data:

```js
const created = await fetchJson('https://api.example.com/stories', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ title: 'New' }),
});
```

The body can be read once. Calling `response.json()` twice throws. Read it into a variable.

## 3.7 Cancellation and timeouts

`fetch` has no timeout by default. An `AbortController` produces a **signal** you pass to `fetch`; calling `abort()` on the controller rejects the pending request with an error whose `name` is `'AbortError'`.

```js
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 5000);
try {
  const response = await fetch(url, { signal: controller.signal });
  // ...
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('Request aborted');
  } else {
    throw error;
  }
} finally {
  clearTimeout(timer);     // do not leave a timer running after success
}
```

Shortcuts: `AbortSignal.timeout(5000)` gives a signal that aborts after the delay, with error name `'TimeoutError'`. `AbortSignal.any([a, b])` combines signals so either can abort. The same signal mechanism cancels event listeners and other async operations in later modules.

## 3.8 Timers

```js
const id = setTimeout(() => console.log('later'), 1000);   // once, after at least 1000 ms
clearTimeout(id);                                           // cancel before it fires

const tick = setInterval(() => console.log('tick'), 1000);  // repeatedly
clearInterval(tick);

import { setTimeout as sleep } from 'node:timers/promises';
await sleep(1000);                                          // promise-based delay in Node
```

Every `setTimeout` or `setInterval` you create should have a path where it is cleared, or it keeps the process alive and keeps running code you have forgotten about. This becomes a real bug class in React (Module 6) where components mount and unmount.

---

# Debugging skills

Learn these now. Every later module assumes them.

## Console methods

```js
console.log('value:', value);            // multiple arguments, spaced
console.error('failed:', error);         // to stderr; use for errors
console.table(stories);                  // arrays of objects as a table
console.dir(deep, { depth: null });      // full nested object; console.log truncates depth
console.time('fetch'); /* ... */ console.timeEnd('fetch');   // elapsed ms
console.count('render');                 // counts calls with this label
console.trace('here');                   // prints a stack trace without throwing
```

Logging an object shows it by reference: if it changes after the log line, some consoles show the later value. `console.log(JSON.stringify(obj))` or `structuredClone(obj)` snapshots it.

## Reading a stack trace

```
Error: Invalid score: "abc"
    at parseScore (file:///Users/you/training/01-js-fundamentals/Scores.js:4:11)
    at loadScores (file:///Users/you/training/01-js-fundamentals/Scores.js:12:18)
    at file:///Users/you/training/01-js-fundamentals/Main.js:3:1
```

Line 1: the error type and message. Each following line is a **frame**: function name, file, line, column, innermost first. Start at the top and find the first frame in a file you wrote. That is where to look. Frames in `node:internal` or `node_modules` are usually where the error was detected, not where it was caused.

## The debugger

A debugger pauses the program on a line you choose and lets you inspect every variable in scope, step one line at a time, and watch the call stack. It replaces most `console.log` debugging and is faster once you know it.

**In VS Code, the easiest way:**

1. Command palette, "JavaScript Debug Terminal". A terminal opens.
2. Click in the gutter to the left of a line number to set a red breakpoint.
3. In that terminal, run `node YourFile.js`. Execution stops at the breakpoint.
4. The Run and Debug sidebar shows Variables (everything in scope), Watch (expressions you add), and Call Stack. Hover over any variable in the editor to see its value.
5. Toolbar: Continue (F5), Step Over (F10, next line), Step Into (F11, into a function call), Step Out (Shift+F11).

**With a launch configuration** so F5 runs the current file:

```json
// .vscode/launch.json in ~/training
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Run current file",
      "program": "${file}",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

**In Chrome:** run `node --inspect-brk YourFile.js`, open `chrome://inspect` in Chrome, click "inspect" under your script. The Sources panel is the same debugger you will use for browser code in Module 2.

**The `debugger` statement.** Writing `debugger;` on a line pauses there when a debugger is attached. Remove it before committing.

**Conditional breakpoints.** Right-click a breakpoint, "Edit Breakpoint", enter an expression such as `i === 57`. It only pauses when the expression is true. This is how you catch the one iteration out of a thousand that misbehaves.

---

# Exercises

Create each exercise as its own file in `01-js-fundamentals/`. Use `node:assert/strict` for checks; an assertion that fails throws and prints both values. Run with `node FileName.js`; no output means every assertion passed.

```js
import assert from 'node:assert/strict';
assert.equal(1 + 1, 2);
assert.deepEqual([1, 2], [1, 2]);     // compares contents of arrays and objects
assert.throws(() => JSON.parse('x'));  // asserts that a function throws
```

## Exercise 1: Array methods by hand

File: `ArrayMethods.js`

Implement `myMap(items, fn)`, `myFilter(items, predicate)`, and `myReduce(items, reducer, initial)` using only `for` loops. (A predicate is a function that returns `true` or `false` for an element. A reducer is the `(runningResult, element) => newRunningResult` function from lesson 2.1.) Each callback must receive `(element, index, array)` like the built-ins. Then solve these five problems twice, once with your functions and once with the built-ins, and assert that both versions agree:

1. Sum of an array of numbers.
2. Maximum of an array of numbers.
3. Group an array of words by first letter into an object of arrays.
4. Unique values from an array, preserving first-seen order.
5. Flatten an array of arrays by one level.

Test each with at least: a normal input, an empty array, and a single element.

Hints: `myReduce` is a loop with one variable for the running result, reassigned on every iteration. For "unique" with `myFilter`, an element is a first occurrence when `items.indexOf(item) === index`. For "max" of an empty array, decide what to return and make both versions return it; `Math.max()` with no arguments returns `-Infinity`.

*Done when:* the file runs with no assertion failures, and your three functions produce identical output to the built-ins on every input you tried.

<details>
<summary>Solution</summary>

```js
import assert from 'node:assert/strict';

export const myMap = (items, fn) => {
  const result = [];
  for (let i = 0; i < items.length; i += 1) {
    result.push(fn(items[i], i, items));
  }
  return result;
};

export const myFilter = (items, predicate) => {
  const result = [];
  for (let i = 0; i < items.length; i += 1) {
    if (predicate(items[i], i, items)) {
      result.push(items[i]);
    }
  }
  return result;
};

export const myReduce = (items, reducer, initial) => {
  let accumulator = initial;
  for (let i = 0; i < items.length; i += 1) {
    accumulator = reducer(accumulator, items[i], i, items);
  }
  return accumulator;
};

// 1. Sum
const sumMine = (numbers) => myReduce(numbers, (total, n) => total + n, 0);
const sumBuiltIn = (numbers) => numbers.reduce((total, n) => total + n, 0);

// 2. Max (-Infinity for empty, matching Math.max())
const maxMine = (numbers) => myReduce(numbers, (best, n) => (n > best ? n : best), -Infinity);
const maxBuiltIn = (numbers) => Math.max(...numbers);

// 3. Group by first letter
const groupMine = (words) => myReduce(words, (groups, word) => {
  const letter = word[0];
  groups[letter] = [...(groups[letter] ?? []), word];
  return groups;
}, {});
const groupBuiltIn = (words) => words.reduce((groups, word) => {
  const letter = word[0];
  groups[letter] = [...(groups[letter] ?? []), word];
  return groups;
}, {});
// Object.groupBy(words, (w) => w[0]) also works, but returns an object with a null
// prototype, which assert.deepEqual treats as different from {}. Spread it into {} first.

// 4. Unique, first-seen order
const uniqueMine = (items) => myFilter(items, (item, index) => items.indexOf(item) === index);
const uniqueBuiltIn = (items) => [...new Set(items)];

// 5. Flatten one level
const flattenMine = (nested) => myReduce(nested, (flat, inner) => flat.concat(inner), []);
const flattenBuiltIn = (nested) => nested.flat();

const numberCases = [[3, 1, 4, 1, 5], [], [7]];
for (const numbers of numberCases) {
  assert.equal(sumMine(numbers), sumBuiltIn(numbers));
  assert.equal(maxMine(numbers), maxBuiltIn(numbers));
}

const wordCases = [['apple', 'avocado', 'banana', 'cherry', 'cranberry'], [], ['kiwi']];
for (const words of wordCases) {
  assert.deepEqual(groupMine(words), groupBuiltIn(words));
}

const dupeCases = [[1, 2, 2, 3, 1], [], ['a'], ['b', 'a', 'b']];
for (const items of dupeCases) {
  assert.deepEqual(uniqueMine(items), uniqueBuiltIn(items));
}

const nestedCases = [[[1, 2], [3], []], [], [[9]], [[1, [2]], [3]]];
for (const nested of nestedCases) {
  assert.deepEqual(flattenMine(nested), flattenBuiltIn(nested));
}

assert.deepEqual(myMap([1, 2, 3], (n, i) => n * i), [0, 2, 6]);
console.log('Exercise 1: all assertions passed');
```

</details>

## Exercise 2: Word frequency

File: `WordFrequency.js`. Run as `node WordFrequency.js path/to/text.txt`.

Read a text file, count how often each word appears, and print the ten most frequent with their counts. Requirements:

- Case-insensitive: `The` and `the` are the same word.
- Punctuation is not part of a word. `end.` counts as `end`. Decide how to treat apostrophes (`don't`) and be consistent.
- Use a `Map` for the counts.
- At least three named functions: one that reads, one that counts, one that reports. The count function must be pure (text in, `Map` out).
- If no path is given, print a usage line to stderr and exit with a non-zero code.
- Get a text file to test with. Project Gutenberg has public-domain books as plain text; any few paragraphs of your own writing also work.

Hints: `text.toLowerCase().match(/[\p{L}']+/gu)` returns an array of runs of letters and apostrophes (or `null` if none, hence `?? []`). `[...counts.entries()]` turns the `Map` into an array of `[word, count]` pairs you can sort. `process.argv[2]` is the first argument after the script name.

*Done when:* running it on a real text file prints a sensible top ten, running it on a file containing only punctuation prints nothing without crashing, and running it with no argument prints usage and `echo $?` shows `1`.

<details>
<summary>Solution</summary>

```js
import { readFile } from 'node:fs/promises';

const TOP_N = 10;
const WORD_COLUMN_WIDTH = 20;
const WORD_PATTERN = /[\p{L}']+/gu;   // runs of letters (any language) and apostrophes

const readText = async (path) => readFile(path, 'utf8');

// Pure: text in, Map of word -> count out.
const countWords = (text) => {
  const counts = new Map();
  const words = text.toLowerCase().match(WORD_PATTERN) ?? [];
  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return counts;
};

const report = (counts, limit) => {
  const ranked = [...counts.entries()].toSorted((a, b) => b[1] - a[1]);
  for (const [word, count] of ranked.slice(0, limit)) {
    console.log(`${word.padEnd(WORD_COLUMN_WIDTH)} ${count}`);
  }
};

const main = async () => {
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node WordFrequency.js <file>');
    process.exitCode = 1;
    return;
  }
  const text = await readText(path);
  report(countWords(text), TOP_N);
};

await main();
```

</details>

## Exercise 3: Closures

File: `Closures.js`

Write and test:

1. `makeCounter(start = 0)` returning an object `{ increment, decrement, value }` where `increment` and `decrement` change the count and return the new value, and `value` returns it without changing it. The count must not be reachable except through those functions.
2. `debounce(fn, waitMs)` returning a function that, when called repeatedly, calls `fn` only once, `waitMs` after the last call, with the last call's arguments.
3. `once(fn)` returning a function that calls `fn` the first time and returns that same result on every later call without calling `fn` again.

Hints: each of the three is "a function that returns a function that remembers something." For `debounce`, remember the timer id from `setTimeout` and clear it on each call. To test `debounce`, call the debounced function three times quickly, then `await sleep(waitMs + margin)` using `setTimeout` from `node:timers/promises`, and assert `fn` ran once. For `once`, remember a flag and the result.

*Done when:* two counters from `makeCounter` are independent, `debounce` calls its function once with the last arguments, `once` calls its function once and returns the cached value afterward, and you have written one paragraph in `notes/module-1.md` explaining where the counter's `count` variable lives after `makeCounter` has returned.

<details>
<summary>Solution</summary>

```js
import assert from 'node:assert/strict';
import { setTimeout as sleep } from 'node:timers/promises';

export const makeCounter = (start = 0) => {
  let count = start;   // captured by the three closures below; not reachable otherwise
  return {
    increment: () => {
      count += 1;
      return count;
    },
    decrement: () => {
      count -= 1;
      return count;
    },
    value: () => count,
  };
};

export const debounce = (fn, waitMs) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);                        // cancel the pending call, if any
    timer = setTimeout(() => fn(...args), waitMs);
  };
};

export const once = (fn) => {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
};

// Tests
const a = makeCounter();
const b = makeCounter(10);
a.increment();
a.increment();
b.decrement();
assert.equal(a.value(), 2);
assert.equal(b.value(), 9);
assert.equal(a.count, undefined);   // no direct access

const DEBOUNCE_MS = 50;
const MARGIN_MS = 20;
const calls = [];
const record = debounce((value) => calls.push(value), DEBOUNCE_MS);
record('first');
record('second');
record('third');
assert.deepEqual(calls, []);                 // nothing yet
await sleep(DEBOUNCE_MS + MARGIN_MS);
assert.deepEqual(calls, ['third']);          // once, with the last arguments

let runs = 0;
const init = once(() => {
  runs += 1;
  return 'ready';
});
assert.equal(init(), 'ready');
assert.equal(init(), 'ready');
assert.equal(runs, 1);

console.log('Exercise 3: all assertions passed');
```

Where `count` lives: in the closure. When `makeCounter` returns, its local variables would normally be discarded. But the three returned functions refer to `count`, so the engine keeps it alive as long as any of them is reachable. Each call to `makeCounter` creates a new `count`, which is why `a` and `b` are independent.

</details>

## Exercise 4: Promise basics

File: `Delay.js`

1. Write `delay(ms)` that returns a promise resolving after `ms` milliseconds.
2. Use it to log `one`, `two`, `three` one second apart, written with `.then` chaining.
3. Write the same thing again with `async/await`.
4. Delete the `.then` version.

Hints: the promise constructor takes `(resolve, reject) => { ... }`; call `resolve()` inside a `setTimeout`. In the chained version, each `.then` callback must `return delay(...)` so the next step waits.

*Done when:* the output appears one second apart, the file contains only the `async/await` version, and you can say in one sentence why the `.then` version needed `return` inside each callback. (Without `return`, the chain does not wait for the inner promise, and all three messages print at once.)

<details>
<summary>Solution</summary>

```js
const ONE_SECOND_MS = 1000;

export const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

// Kept here only for comparison; the exercise asks you to delete it.
// delay(ONE_SECOND_MS)
//   .then(() => { console.log('one'); return delay(ONE_SECOND_MS); })
//   .then(() => { console.log('two'); return delay(ONE_SECOND_MS); })
//   .then(() => { console.log('three'); });

const main = async () => {
  for (const message of ['one', 'two', 'three']) {
    await delay(ONE_SECOND_MS);
    console.log(message);
  }
};

await main();
```

Node ships this already as `setTimeout` from `node:timers/promises`. Writing it yourself once shows what the promise constructor is for.

</details>

## Exercise 5: Parallel versus sequential

File: `TopStories.js`

Using the Hacker News API:

- `https://hacker-news.firebaseio.com/v0/topstories.json` returns an array of story ids.
- `https://hacker-news.firebaseio.com/v0/item/{id}.json` returns one story with `title`, `score`, `by`, `url`, and more.

1. Write `fetchJson(url)` that throws on a non-2xx response.
2. Fetch the top ten ids.
3. Fetch the ten stories sequentially (one `await` per iteration) and time it with `performance.now()`.
4. Fetch the same ten in parallel with `Promise.all` and time it.
5. Print both timings and the stories as `score  title`.
6. Handle failure: a network error or a bad status must print a clear message and set a non-zero exit code, not print a stack trace.

Hints: the base URL and the limit are named constants. A small `timed(label, fn)` helper that awaits `fn()` and prints the elapsed time keeps `main` readable. For step 6, wrap the body of `main` in `try/catch` and set `process.exitCode = 1` in the catch. To test the failure path, temporarily change the host to `hacker-news.invalid`.

*Done when:* the parallel version is clearly faster, a non-2xx response is treated as an error, and a bad hostname produces one readable line of output and a non-zero exit code.

<details>
<summary>Solution</summary>

```js
const BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const STORY_LIMIT = 10;

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} for ${url}`);
  }
  return response.json();
};

const fetchTopIds = async (limit) => {
  const ids = await fetchJson(`${BASE_URL}/topstories.json`);
  return ids.slice(0, limit);
};

const fetchStory = (id) => fetchJson(`${BASE_URL}/item/${id}.json`);

const fetchSequential = async (ids) => {
  const stories = [];
  for (const id of ids) {
    stories.push(await fetchStory(id));
  }
  return stories;
};

const fetchParallel = (ids) => Promise.all(ids.map(fetchStory));

const timed = async (label, fn) => {
  const start = performance.now();
  const result = await fn();
  console.log(`${label}: ${Math.round(performance.now() - start)} ms`);
  return result;
};

const printStories = (stories) => {
  for (const story of stories) {
    console.log(`${String(story.score).padStart(5)}  ${story.title}`);
  }
};

const main = async () => {
  try {
    const ids = await fetchTopIds(STORY_LIMIT);
    await timed('sequential', () => fetchSequential(ids));
    const stories = await timed('parallel', () => fetchParallel(ids));
    printStories(stories);
  } catch (error) {
    console.error(`Failed to load stories: ${error.message}`);
    process.exitCode = 1;
  }
};

await main();
```

Note that `Promise.all` rejects as soon as one story fails, discarding the others. If you would rather show the nine that worked, use `Promise.allSettled` and filter for `status === 'fulfilled'`.

</details>

## Exercise 6: Timeout with AbortController

File: `FetchWithTimeout.js`

Write `fetchWithTimeout(url, timeoutMs)` that:

- Returns parsed JSON on success.
- Throws an error with a clear message on a non-2xx status.
- Aborts the request and throws an error whose message includes the URL and the timeout when the request takes longer than `timeoutMs`. Attach the original abort error as `cause`.
- Always clears its timer, whether it succeeds or fails.

Test it against a Hacker News URL with a generous timeout (success) and with a timeout of 1 millisecond (guaranteed to abort).

Hints: create an `AbortController`, pass `controller.signal` to `fetch`, call `controller.abort()` in a `setTimeout`. In the `catch`, `error.name === 'AbortError'` identifies the abort. Put `clearTimeout` in `finally`.

*Done when:* the 1 ms call throws your timeout message and not a raw `AbortError`, the generous call returns data, and the process exits promptly after both (a leaked timer would keep it alive).

<details>
<summary>Solution</summary>

```js
import assert from 'node:assert/strict';

export const fetchWithTimeout = async (url, timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }
    return await response.json();   // await here so the catch below sees a body parse failure
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${timeoutMs} ms`, { cause: error });
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

const URL = 'https://hacker-news.firebaseio.com/v0/item/1.json';
const GENEROUS_MS = 10_000;
const IMPOSSIBLE_MS = 1;

const story = await fetchWithTimeout(URL, GENEROUS_MS);
assert.equal(typeof story.title, 'string');

await assert.rejects(
  () => fetchWithTimeout(URL, IMPOSSIBLE_MS),
  (error) => error.message.includes('timed out') && error.cause?.name === 'AbortError',
);

console.log('Exercise 6: all assertions passed');
```

Shorter alternative for the signal: `fetch(url, { signal: AbortSignal.timeout(timeoutMs) })`. The error name is then `'TimeoutError'` and there is no timer to clear. The manual version is worth writing once so you know what the shortcut does.

</details>

## Exercise 7: Event loop prediction

File: `EventLoop.js`

Before running it, write down the output order of this script:

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => {
  console.log('C');
  queueMicrotask(() => console.log('D'));
  setTimeout(() => console.log('E'), 0);
});
queueMicrotask(() => console.log('F'));
setTimeout(() => {
  console.log('G');
  Promise.resolve().then(() => console.log('H'));
}, 0);
console.log('I');
```

Then run it and compare.

*Done when:* your prediction matched, or you can explain every line where it did not, in terms of "current task," "microtask queue," and "task queue." Write the explanation in `notes/module-1.md`.

<details>
<summary>Answer</summary>

```
A I C F D B G H E
```

- `A`, `I`: the current task runs to completion first. Everything else is queued.
- Stack empty; run all microtasks in the order they were queued: the `.then` callback (`C`) runs first. It queues microtask `D` and timer `E`. Then `F`, which was queued before `D`. Then `D`, because the microtask queue is run until empty, including items added while it was running.
- Take one task: timer `B`.
- Microtasks: none.
- Take one task: timer `G`. It queues microtask `H`.
- Run all microtasks: `H`. This is why `H` prints before `E` even though `E` was queued earlier: microtasks run after every task, before the next task.
- Take one task: timer `E`.

</details>

---

# Glossary

- **Argument.** A value passed to a function when calling it. (A **parameter** is the name in the function definition.)
- **Asynchronous.** Work that completes later, with the result delivered through a callback or promise.
- **Block.** Code between `{` and `}`.
- **Callback.** A function passed to another function to be called later.
- **Closure.** A function plus the variables in scope where it was defined.
- **Coercion.** Automatic type conversion.
- **Destructuring.** Syntax for pulling values out of arrays or objects into variables.
- **Event loop.** The scheduler that runs tasks and microtasks one at a time.
- **Expression.** Code that produces a value (`a + b`, `fn()`). A **statement** does something (`if`, `for`, `const x = ...`).
- **Falsy.** A value that converts to `false`: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`.
- **Higher-order function.** A function that takes or returns a function.
- **Hoisting.** The engine notes every declaration in a scope before running any of its code. A function declaration can therefore be called from a line above it. A `let` or `const` name is known but reading it before its line is an error.
- **Immutable.** Cannot be changed after creation. Primitives are immutable by nature. Objects can be changed, so they are only immutable if everyone writing the code agrees not to change them and makes copies instead.
- **Iterable.** Anything `for...of` and spread can walk: arrays, strings, `Map`, `Set`, and more.
- **Microtask.** A queued promise reaction or `queueMicrotask` callback; runs before the next task.
- **Module.** A file with its own scope that shares things via `export`.
- **Mutation.** Changing an existing object or array in place.
- **Primitive.** One of the seven non-object types.
- **Promise.** An object standing for a value that will arrive later, or an error.
- **Pure function.** Same input, same output, no side effects.
- **Reference.** A pointer to an object. Variables holding objects hold references.
- **Rest / spread.** `...` collecting remaining items into an array or object (rest) or expanding one into a list (spread).
- **Scope.** The set of names visible at a point in the code.
- **Side effect.** Any observable change outside a function's return value: mutation, I/O, logging.
- **Task.** A unit of work from the task queue: a timer callback, an I/O callback.
- **Truthy.** Any value that is not falsy.

---

# Self-check

Answer without running code, then check.

1. What is the output of `console.log(typeof null, typeof [], typeof (() => {}))`?
2. Why does `[] == false` evaluate to `true`, and what should you write instead to test for an empty array?
3. `const x = { a: 1 }; const y = x; y.a = 2;` What is `x.a`, and why?
4. What does `'a' || 'b'` return? What does `0 ?? 5` return? What does `0 || 5` return?
5. What is the difference between `let` and `var` inside a `for` loop with a `setTimeout` callback?
6. Write a one-line arrow function that returns the object `{ ok: true }`.
7. What does `stories.sort()` do wrong when `stories` is an array of numbers, and what should you call instead?
8. What does `JSON.parse(JSON.stringify({ when: new Date(), fn: () => 1, missing: undefined }))` give you?
9. A function is declared `async`. What does it return if its body is `return 5;`?
10. What is wrong with `ids.forEach(async (id) => { await save(id); }); console.log('saved');`?
11. `fetch` returned a response with status 500. Did the `await fetch(...)` throw?
12. In what order do these print: `setTimeout(() => console.log(1), 0); Promise.resolve().then(() => console.log(2)); console.log(3);`?

<details>
<summary>Answers</summary>

1. `object object function`.
2. `==` coerces both sides: `[]` becomes `''` becomes `0`, and `false` becomes `0`. Use `items.length === 0`.
3. `2`. `y` holds a reference to the same object as `x`; there is one object.
4. `'a'` (first truthy). `0` (`??` only replaces `null`/`undefined`). `5` (`||` replaces any falsy value).
5. `var` creates one shared variable, so every callback sees the final value. `let` creates a fresh binding per iteration, so each callback sees its own value.
6. `const ok = () => ({ ok: true });` The parentheses stop the braces from being read as a block.
7. It sorts by string comparison (`10` before `9`) and mutates the array. Use `numbers.toSorted((a, b) => a - b)`.
8. `{ when: '2026-...' }`: the date becomes an ISO string, the function and the `undefined` property are dropped.
9. A promise that resolves to `5`.
10. `forEach` does not wait for the promises its callbacks return. `'saved'` prints before any save completes. Use `for...of` with `await`, or `await Promise.all(ids.map(save))`.
11. No. `fetch` only rejects on network failure. Check `response.ok` and throw yourself.
12. `3 2 1`. Current task, then microtasks, then the timer task.

</details>

---

# Resources

- The Modern JavaScript Tutorial, Part 1 chapters 2 through 11: https://javascript.info. The clearest written explanation of the language. Read the chapter after the matching lesson here, not before.
- MDN JavaScript Reference, for looking up any method: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
- "What the heck is the event loop anyway?" by Philip Roberts. A 26-minute talk with an animated model of the loop. Watch it before 3.1 and again after 3.8.
- Node.js documentation for `fs/promises`, `timers/promises`, and `assert`: https://nodejs.org/api/
- Loupe, the event loop visualizer from the talk above: http://latentflip.com/loupe. Paste Exercise 7 into it.
