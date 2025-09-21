import React from 'react';
import {range} from "../../utils";
import { GUESS_LENGTH } from '../../constants';
import { checkGuess } from '../../game-helpers';

function Guess({guess, answer}) {
  const spans = [];
  if (guess) {
    checkGuess(guess, answer).forEach((result) => {
      const classes = ["cell"];
      classes.push(result.status);
      spans.push(<span className={classes.join(" ")}>{result.letter}</span>);
    })
  } else {
    range(GUESS_LENGTH).forEach((index) => {
      spans.push(<span className="cell">{" "}</span>);
    })
  }

  return <p className="guess">{spans}</p>;
}

export default Guess;
