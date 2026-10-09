import { readFile } from "node:fs/promises";

const readTxt = async (path) => {
  return readFile(path, 'utf8');
};

// const text = await readTxt(process.argv[2]);
// console.log(text.slice(0, 100));

const countWords = (text) => {
  const counts = new Map();
  const words = text.toLowerCase().replaceAll('’', "'").match(/[\p{L}']+/gu) ?? [];

  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) +1)
  }
  return counts;
};

// console.log(countWords(text));

const report = (counts, limit) => {
  const ranked = [...counts.entries()].toSorted((a,b) => b[1] - a[1]);

  for (const [word, count] of ranked.slice(0, limit)) {
      console.log(`${word.padEnd(20)} ${count}`);
  }

};

const main = async () => {
  const path = process.argv[2];

  if (!path) {
    console.error('Usage: node WordFrequency.js <file>');
    process.exit(1);
  }

  const text = await readTxt(path);
  const counts = countWords(text);
  report(counts, 10);
};

await main();
