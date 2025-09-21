import React from 'react';
import {range} from "../../utils";
import { GUESS_LENGTH } from '../../constants';

function Guess({guess}) {
  const spans = [];
  if (guess) {
    guess.split("").forEach((character) => {
      spans.push(<span class="cell">{character}</span>);
    })
  } else {
    range(GUESS_LENGTH).forEach((index) => {
      spans.push(<span class="cell">{" "}</span>);
    })
  }

  return <p className="guess">{spans}</p>;
}

export default Guess;
