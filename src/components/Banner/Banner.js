import React from 'react';

function Banner({answer, gameOutcome, gameOver, guesses, resetGame}) {

  function Button() {
    return <button onClick={resetGame} style={{marginLeft: '10px', padding: '4px 8px', cursor: 'pointer'}}>Reset Game</button>;
  }

  if (!gameOver) {
    return null;
  }

  if (gameOutcome === "win") {
    return (<div className="happy banner">
      <p>
        <strong>Congratulations!</strong> Got it in <strong>{guesses.length} guesses</strong>.
        <Button></Button>
      </p>
    </div>);
  } else {
    return (<div className="sad banner">
      <p>Sorry, the correct answer is <strong>{answer}</strong>.</p>
      <Button></Button>
    </div>);
  }
}

export default Banner;
