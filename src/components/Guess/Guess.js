import React from 'react';
import {range} from "../../utils";
import { GUESS_LENGTH } from '../../constants';
import { checkGuess } from '../../game-helpers';

function Guess({guess, answer}) {
  const spans = [];

  if (guess) {
    const results = checkGuess(guess, answer);
    results.forEach((result, index) => {
      const classes = ["cell"];
      classes.push(result.status);
      spans.push(<span key={index} className={classes.join(" ")}>{result.letter}</span>);
    });
  } else {
    range(GUESS_LENGTH).forEach((index) => {
      spans.push(<span key={index} className="cell"> </span>);
    });
  }

  return <p className="guess">{spans}</p>;
}

export default Guess;
