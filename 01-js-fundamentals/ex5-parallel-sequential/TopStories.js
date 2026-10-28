const BASE_URL = "https://hacker-news.firebaseio.com/v0";
// const HACKER_NEWS_SINGLE = "https://hacker-news.firebaseio.com/v0/item/{id}.json";
const STORY_LIMIT = 10;

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} for ${url}`);
  }
  return response.json();
};

// fetch the top ids using slice
const fetchTopIds = async (limit) => {
  const ids = await fetchJson(`${BASE_URL}/topstories.json`);
  return ids.slice(0, limit);
};

// fetch a single story
const fetchStory = (id) => fetchJson(`${BASE_URL}/item/${id}.json`);

// fetch sequential
const fetchSequential = async (ids) => {
  const stories = [];
  for (const id of ids) {
    stories.push(await fetchStory(id));
  }
  return stories;
};

// fetch parallel
const fetchParallel = (ids) => Promise.all(ids.map(fetchStory));

const timed = async (label, fn) => {
  const start = performance.now();
  const result = await fn();
  console.log(`${label}: ${Math.round(performance.now() - start)} ms`);
  return result;
};

const printStories = (stories) => {
  for (const story of stories) {
    console.log(`${String(story.score).padStart(5)} ${story.title}`);
  }
};

const main = async () => {
  try {
    const ids = await fetchTopIds(STORY_LIMIT);
    await timed('sequential', () => fetchSequential(ids));
    const stories = await timed('parallel', () => fetchParallel(ids));
    printStories(stories);
  }
  catch (error) {
    console.error(`Failed to load stories: ${error.message}`);
    process.exitCode = 1;
  }
};

await main();










