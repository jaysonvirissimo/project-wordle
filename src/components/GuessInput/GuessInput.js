import React from 'react';

function GuessInput({guesses, setGuesses}) {
  const requiredLength = 5;
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
    <input id="guess-input" maxLength={requiredLength} minLength={requiredLength} onChange={(event) => setGuess(event.target.value)} type="text" value={guess} />
  </form>);
}

export default GuessInput;
