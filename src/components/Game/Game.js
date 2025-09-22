import React from 'react';

import { sampleWord } from '../../utils';
import WORDS_DICT from '../../words.json';
import { checkGuess } from '../../game-helpers';
import { NUM_OF_GUESSES_ALLOWED } from '../../constants';
import GuessInput from '../GuessInput/GuessInput';
import GuessResults from '../GuessResults/GuessResults';
import Banner from '../Banner/Banner';
import HintSection from '../HintSection/HintSection';

function Game() {
  const [wordInfo, setWordInfo] = React.useState(() => sampleWord(WORDS_DICT));
  const [guesses, setGuesses] = React.useState([]);
  const [gameOver, setGameOver] = React.useState(false);
  const [gameOutcome, setGameOutcome] = React.useState(undefined);
  const [showHint, setShowHint] = React.useState(false);

  // Maintain backward compatibility
  const answer = wordInfo.word;

  function resetGame() {
    setWordInfo(sampleWord(WORDS_DICT));
    setGuesses([]);
    setGameOver(false);
    setGameOutcome(undefined);
    setShowHint(false);
  }

  function toggleHint() {
    setShowHint(!showHint);
  }

  function handleGuessSubmit(normalizedGuess) {
    const newGuesses = [...guesses, normalizedGuess];
    const correctGuess = checkGuess(normalizedGuess, answer).every(
      result => result.status === 'correct'
    );

    if (correctGuess) {
      setGameOver(true);
      setGameOutcome('win');
    } else if (newGuesses.length >= NUM_OF_GUESSES_ALLOWED) {
      setGameOver(true);
      setGameOutcome('lose');
    }

    setGuesses(newGuesses);
  }

  return (
    <>
      <Banner
        answer={answer}
        gameOutcome={gameOutcome}
        gameOver={gameOver}
        guesses={guesses}
        resetGame={resetGame}
        wordData={wordInfo.data}
      ></Banner>
      <GuessResults answer={answer} guesses={guesses}></GuessResults>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '10px',
        }}
      >
        <GuessInput
          gameOver={gameOver}
          onGuessSubmit={handleGuessSubmit}
        ></GuessInput>
        <HintSection
          showHint={showHint}
          onToggleHint={toggleHint}
          wordData={wordInfo.data}
          gameOver={gameOver}
        ></HintSection>
      </div>
    </>
  );
}

export default Game;
