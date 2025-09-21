import React from 'react';
import {range} from "../../utils";

function Guess({guess}) {
  const spans = [];
  if (guess) {
    guess.split("").forEach((character) => {
      spans.push(<span class="cell">{character}</span>);
    })
  } else {
    range(5).forEach((index) => {
      spans.push(<span class="cell">{" "}</span>);
    })
  }

  return <p className="guess">{spans}</p>;
}

export default Guess;
