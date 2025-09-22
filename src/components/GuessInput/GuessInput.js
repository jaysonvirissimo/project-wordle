import React from 'react';
import { GUESS_LENGTH } from '../../constants';
import { normalizeDiacritics } from '../../utils/normalize';

function GuessInput({ gameOver, onGuessSubmit }) {
  const [guess, setGuess] = React.useState("");

  function onSubmit(event) {
    event.preventDefault();
    const normalizedGuess = normalizeDiacritics(guess);
    onGuessSubmit(normalizedGuess);
    setGuess("");
  }

  function handleInputChange(event) {
    const value = event.target.value;
    setGuess(value);
  }

  return (<form className="guess-input-wrapper" onSubmit={onSubmit}>
    <label htmlFor="guess-input">Enter guess:</label>
    <input disabled={gameOver} id="guess-input" maxLength={GUESS_LENGTH} minLength={GUESS_LENGTH} onChange={handleInputChange} type="text" value={guess} />
  </form>);
}

export default GuessInput;
