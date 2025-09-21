import React from 'react';

function GuessResults({guesses}) {
  const entries = guesses.map((guess) => {
    return <p className="guess">{guess}</p>;
  });
  
  return <div className="guess-results">{entries}</div>;
}

export default GuessResults;
