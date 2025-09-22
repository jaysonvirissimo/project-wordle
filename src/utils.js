export const sample = arr => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const range = (start, end, step = 1) => {
  let output = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

export const sampleWord = wordsDict => {
  const words = Object.keys(wordsDict);
  const randomWord = sample(words);
  return {
    word: randomWord,
    data: wordsDict[randomWord],
  };
};
