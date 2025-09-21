import React from 'react';
import Guess from '../Guess/Guess';
import {NUM_OF_GUESSES_ALLOWED} from '../../constants';

function GuessResults({guesses}) {
  const entries = guesses.map((guess) => {
    return <Guess guess={guess} key={guess}></Guess>;
  });

  while (entries.length < NUM_OF_GUESSES_ALLOWED) {
    entries.push(<Guess key={entries.length}></Guess>);
  }
  
  return <div className="guess-results">{entries}</div>;
}

export default GuessResults;
