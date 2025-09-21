import React from 'react';
import { GUESS_LENGTH } from '../../constants';
import { checkGuess } from '../../game-helpers';
import { NUM_OF_GUESSES_ALLOWED } from '../../constants';
import { normalizeDiacritics } from '../../utils/normalize';

function GuessInput({answer, guesses, gameOver, setGameOutcome, setGameOver, setGuesses}) {
  const [guess, setGuess] = React.useState("");

  function onSubmit(event) {
    event.preventDefault();
    const newGuesses = [...guesses];
    const normalizedGuess = normalizeDiacritics(guess);
    newGuesses.push(normalizedGuess);
    const correctGuess = checkGuess(normalizedGuess, answer).every((result) => result.status === "correct");
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

  function handleInputChange(event) {
    const value = event.target.value;
    // Allow typing with diacritics, but normalize for display
    setGuess(value);
  }

  return (<form className="guess-input-wrapper" onSubmit={onSubmit}>
    <label htmlFor="guess-input">Enter guess:</label>
    <input disabled={gameOver} id="guess-input" maxLength={GUESS_LENGTH} minLength={GUESS_LENGTH} onChange={handleInputChange} type="text" value={guess} />
  </form>);
}

export default GuessInput;
