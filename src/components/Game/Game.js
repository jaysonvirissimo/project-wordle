import React from 'react';

import { sample } from '../../utils';
import { WORDS } from '../../data';
import GuessInput from '../GuessInput/GuessInput';
import GuessResults from '../GuessResults/GuessResults';
import Banner from '../Banner/Banner';

function Game() {
  const [answer, setAnswer] = React.useState(sample(WORDS))
  const [guesses, setGuesses] = React.useState([]);
  const [gameOver, setGameOver] = React.useState(false);
  const [gameOutcome, setGameOutcome] = React.useState(undefined);

  function resetGame() {
    setAnswer(sample(WORDS));
    setGuesses([]);
    setGameOver(false);
    setGameOutcome(undefined);
  }

  return (<>
    <Banner answer={answer} gameOutcome={gameOutcome} gameOver={gameOver} guesses={guesses} resetGame={resetGame} ></Banner>
    <GuessResults answer={answer} guesses={guesses}></GuessResults>

    <GuessInput answer={answer} gameOver={gameOver} guesses={guesses} setGameOutcome={setGameOutcome} setGameOver={setGameOver} setGuesses={setGuesses}></GuessInput>
  </>);
}

export default Game;
