import React from 'react';

import { sample } from '../../utils';
import { WORDS } from '../../data';
import GuessInput from '../GuessInput/GuessInput';
import GuessResults from '../GuessResults/GuessResults';
import Banner from '../Banner/Banner';

// Pick a random word on every pageload.
const answer = sample(WORDS);
// To make debugging easier, we'll log the solution in the console.
console.info({ answer });

function Game() {
  const [guesses, setGuesses] = React.useState([]);
  const [gameOver, setGameOver] = React.useState(false);
  const [gameOutcome, setGameOutcome] = React.useState(undefined);

  return (<>
    <Banner answer={answer} gameOutcome={gameOutcome} gameOver={gameOver} guesses={guesses}></Banner>
    <GuessResults answer={answer} guesses={guesses}></GuessResults>
    
    <GuessInput answer={answer} gameOver={gameOver} guesses={guesses} setGameOutcome={setGameOutcome} setGameOver={setGameOver} setGuesses={setGuesses}></GuessInput> 
  </>);
}

export default Game;
