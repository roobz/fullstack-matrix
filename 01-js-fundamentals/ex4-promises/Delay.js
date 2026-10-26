const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

// delay(1000)
//   .then(() => {
//     console.log('one second');
//     return delay(1000);
//   })
//   .then(() => {
//     console.log('two seconds');
//     return delay(1000);
//   })
//   .then(() => {
//     console.log('three seconds');
//     return delay(1000);
//   })
//   .catch((error) => {
//     console.error(error.message);
//   })
//   .finally(() => {
//     console.log('done either way');
//   });

  const loadThree = async () => {
  try {
    await delay(1000);
    console.log('one second');
    await delay(1000);
    console.log('two seconds');
    await delay(1000);
    console.log('three seconds');
  } catch (error) {
    console.error(error.message);
    throw error;
  } finally {
    console.log('done either way');
  }
};

loadThree();