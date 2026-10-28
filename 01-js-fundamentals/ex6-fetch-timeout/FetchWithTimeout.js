import assert from 'node:assert/strict';

const URL = 'https://hacker-news.firebaseio.com/v0/item/1.json';
const GENEROUS_MS = 10_000;
const IMPOSSIBLE_MS = 1;

const fetchWithTimeout = async (url, timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

try {
  const response = await fetch(url, { signal: controller.signal });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return await response.json();

} catch (error) {
  if (error.name === 'AbortError') {
    throw new Error(`Request to ${url} timed out after ${timeoutMs} ms`, { cause: error });
  }
    throw error;

  } finally {
  clearTimeout(timer);     // do not leave a timer running after success
  }
};

const story = await fetchWithTimeout(URL, GENEROUS_MS);
assert.equal(typeof story.title, 'string');

await assert.rejects(
  () => fetchWithTimeout(URL, IMPOSSIBLE_MS),
  (error) => error.message.includes('timed out') && error.cause?.name === 'AbortError',
);

console.log('Exercise 6: all assertions passed');
