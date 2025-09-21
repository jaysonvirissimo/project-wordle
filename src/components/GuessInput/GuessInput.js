import React from 'react';
import { GUESS_LENGTH } from '../../constants';

function GuessInput({guesses, setGuesses}) {
  const [guess, setGuess] = React.useState("");
 

  function onSubmit(event) {
    event.preventDefault();
    const newGuesses = [...guesses];
    newGuesses.push(guess.toUpperCase());
    setGuesses(newGuesses);
    setGuess("");
  }

  return (<form className="guess-input-wrapper" onSubmit={onSubmit}>
    <label htmlFor="guess-input">Enter guess:</label>
    <input id="guess-input" maxLength={GUESS_LENGTH} minLength={GUESS_LENGTH} onChange={(event) => setGuess(event.target.value)} type="text" value={guess} />
  </form>);
}

export default GuessInput;
