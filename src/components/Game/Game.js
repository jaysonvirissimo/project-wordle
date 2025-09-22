import React from 'react';

import { sampleWord } from '../../utils';
import WORDS_DICT from '../../words.json';
import GuessInput from '../GuessInput/GuessInput';
import GuessResults from '../GuessResults/GuessResults';
import Banner from '../Banner/Banner';

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

  return (<>
    <Banner answer={answer} gameOutcome={gameOutcome} gameOver={gameOver} guesses={guesses} resetGame={resetGame} wordData={wordInfo.data}></Banner>
    <GuessResults answer={answer} guesses={guesses}></GuessResults>

    <div style={{display: 'flex', alignItems: 'flex-end', gap: '10px', justifyContent: 'center', marginBottom: '10px'}}>
      <GuessInput answer={answer} gameOver={gameOver} guesses={guesses} setGameOutcome={setGameOutcome} setGameOver={setGameOver} setGuesses={setGuesses}></GuessInput>
      {!gameOver && (
        <button onClick={toggleHint} style={{padding: '8px 12px', cursor: 'pointer'}}>
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
      )}
    </div>

    {showHint && !gameOver && (
      <div style={{textAlign: 'center', margin: '10px 0', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px'}}>
        <strong>Hint:</strong> {wordInfo.data.meaning} ({wordInfo.data.part})
      </div>
    )}
  </>);
}

export default Game;
