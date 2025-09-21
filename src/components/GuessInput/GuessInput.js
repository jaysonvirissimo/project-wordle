import React from 'react';
import { GUESS_LENGTH } from '../../constants';
import { checkGuess } from '../../game-helpers';
import { NUM_OF_GUESSES_ALLOWED } from '../../constants';

function GuessInput({answer, guesses, gameOver, setGameOutcome, setGameOver, setGuesses}) {
  const [guess, setGuess] = React.useState("");

  function onSubmit(event) {
    event.preventDefault();
    const newGuesses = [...guesses];
    const newGuess = guess.toUpperCase();
    newGuesses.push(newGuess);
    const correctGuess = checkGuess(newGuess, answer).every((result) => result.status === "correct");
    if (correctGuess) {
      setGameOver(true);
      setGameOutcome("win");
    } else if (newGuesses.length >= NUM_OF_GUESSES_ALLOWED) {
      setGameOver(true);
      setGameOutcome("lose");
    }
    
    setGuesses(newGuesses);
    setGuess("");
  }

  return (<form className="guess-input-wrapper" onSubmit={onSubmit}>
    <label htmlFor="guess-input">Enter guess:</label>
    <input disabled={gameOver} id="guess-input" maxLength={GUESS_LENGTH} minLength={GUESS_LENGTH} onChange={(event) => setGuess(event.target.value)} type="text" value={guess} />
  </form>);
}

export default GuessInput;
