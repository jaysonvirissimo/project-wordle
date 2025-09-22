import React from 'react';

function HintSection({ showHint, onToggleHint, wordData, gameOver }) {
  if (gameOver) {
    return null;
  }

  return (
    <>
      <button onClick={onToggleHint} style={{padding: '8px 12px', cursor: 'pointer'}}>
        {showHint ? 'Hide Hint' : 'Show Hint'}
      </button>

      {showHint && (
        <div style={{textAlign: 'center', margin: '10px 0', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px'}}>
          <strong>Hint:</strong> {wordData.meaning} ({wordData.part})
        </div>
      )}
    </>
  );
}

export default HintSection;