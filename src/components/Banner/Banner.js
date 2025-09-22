import React from 'react';

function Banner({
  answer,
  gameOutcome,
  gameOver,
  guesses,
  resetGame,
  wordData,
}) {
  function Button() {
    return (
      <button
        onClick={resetGame}
        style={{ marginLeft: '10px', padding: '4px 8px', cursor: 'pointer' }}
      >
        Reset Game
      </button>
    );
  }

  if (!gameOver) {
    return null;
  }

  if (gameOutcome === 'win') {
    return (
      <div className="happy banner">
        <p>
          <strong>Congratulations!</strong> Got it in{' '}
          <strong>{guesses.length} guesses</strong>.
        </p>
        {wordData && (
          <p style={{ fontSize: '0.9em', marginTop: '5px' }}>
            <strong>{answer}</strong> means "{wordData.meaning}" (
            {wordData.part})
          </p>
        )}
        <Button></Button>
      </div>
    );
  } else {
    return (
      <div className="sad banner">
        <p>
          Sorry, the correct answer is <strong>{answer}</strong>.
        </p>
        {wordData && (
          <p style={{ fontSize: '0.9em', marginTop: '5px' }}>
            It means "{wordData.meaning}" ({wordData.part})
          </p>
        )}
        <Button></Button>
      </div>
    );
  }
}

export default Banner;
