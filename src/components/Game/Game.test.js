import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game from './Game';

// Mock all child components
jest.mock('../GuessInput/GuessInput', () => {
  return function MockGuessInput({ gameOver, onGuessSubmit }) {
    return (
      <div data-testid="guess-input">
        <input
          data-testid="guess-input-field"
          disabled={gameOver}
          placeholder="Mock GuessInput"
        />
        <button
          data-testid="submit-guess"
          onClick={() => {
            // Mock submitting a guess
            onGuessSubmit && onGuessSubmit('TERRA');
          }}
        >
          Submit
        </button>
      </div>
    );
  };
});

jest.mock('../GuessResults/GuessResults', () => {
  return function MockGuessResults({ answer, guesses }) {
    return (
      <div data-testid="guess-results">
        <div>Answer: {answer}</div>
        <div>Guesses: {guesses.join(', ')}</div>
      </div>
    );
  };
});

jest.mock('../Banner/Banner', () => {
  return function MockBanner({
    answer,
    gameOutcome,
    gameOver,
    guesses,
    resetGame,
    wordData,
  }) {
    if (!gameOver) return null;
    return (
      <div data-testid="banner">
        <div>Game Over: {gameOutcome}</div>
        <div>Answer: {answer}</div>
        {wordData && <div>Meaning: {wordData.meaning}</div>}
        <button data-testid="reset-button" onClick={resetGame}>
          Reset
        </button>
      </div>
    );
  };
});

jest.mock('../HintSection/HintSection', () => {
  return function MockHintSection({
    showHint,
    onToggleHint,
    wordData,
    gameOver,
  }) {
    if (gameOver) return null;
    return (
      <>
        <button data-testid="hint-button" onClick={onToggleHint}>
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
        {showHint && (
          <div data-testid="hint-display">
            Hint: {wordData.meaning} ({wordData.part})
          </div>
        )}
      </>
    );
  };
});

// Mock the utils and words data
jest.mock('../../utils', () => ({
  sampleWord: jest.fn(() => ({
    word: 'TERRA',
    data: {
      meaning: 'earth, land',
      part: 'noun',
    },
  })),
}));

jest.mock('../../words.json', () => [
  {
    word: 'TERRA',
    data: {
      meaning: 'earth, land',
      part: 'noun',
    },
  },
  {
    word: 'AQUA',
    data: {
      meaning: 'water',
      part: 'noun',
    },
  },
]);

const { sampleWord } = require('../../utils');

describe('Game', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock to return default word
    sampleWord.mockReturnValue({
      word: 'TERRA',
      data: {
        meaning: 'earth, land',
        part: 'noun',
      },
    });
  });

  describe('Component Initialization', () => {
    it('renders all child components', () => {
      render(<Game />);

      expect(screen.getByTestId('guess-results')).toBeInTheDocument();
      expect(screen.getByTestId('guess-input')).toBeInTheDocument();
      // Banner should not be visible initially (game not over)
      expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
    });

    it('initializes with a word from the dictionary', () => {
      render(<Game />);

      expect(sampleWord).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Answer: TERRA')).toBeInTheDocument();
    });

    it('initializes with empty guesses', () => {
      render(<Game />);

      expect(screen.getByText('Guesses:')).toBeInTheDocument();
    });

    it('initializes with game not over', () => {
      render(<Game />);

      const input = screen.getByTestId('guess-input-field');
      expect(input).not.toBeDisabled();
    });

    it('initializes with hint hidden', () => {
      render(<Game />);

      expect(screen.queryByText(/hint:/i)).not.toBeInTheDocument();
      expect(screen.getByText('Show Hint')).toBeInTheDocument();
    });
  });

  describe('Hint System', () => {
    it('renders show hint button when game is not over', () => {
      render(<Game />);

      const hintButton = screen.getByTestId('hint-button');
      expect(hintButton).toBeInTheDocument();
      expect(hintButton).toHaveTextContent('Show Hint');
    });

    it('toggles hint visibility when button is clicked', () => {
      render(<Game />);

      const hintButton = screen.getByTestId('hint-button');
      fireEvent.click(hintButton);

      expect(screen.getByTestId('hint-display')).toBeInTheDocument();
      expect(screen.getByText('Hint: earth, land (noun)')).toBeInTheDocument();
      expect(hintButton).toHaveTextContent('Hide Hint');
    });

    it('hides hint when hide button is clicked', () => {
      render(<Game />);

      const hintButton = screen.getByTestId('hint-button');
      fireEvent.click(hintButton);

      expect(hintButton).toHaveTextContent('Hide Hint');
      fireEvent.click(hintButton);

      expect(screen.queryByTestId('hint-display')).not.toBeInTheDocument();
      expect(hintButton).toHaveTextContent('Show Hint');
    });

    it('displays correct hint content', () => {
      render(<Game />);

      const hintButton = screen.getByTestId('hint-button');
      fireEvent.click(hintButton);

      expect(screen.getByTestId('hint-display')).toBeInTheDocument();
      expect(screen.getByText('Hint: earth, land (noun)')).toBeInTheDocument();
    });

    it('does not render hint button when game is over', () => {
      render(<Game />);

      // Win the game
      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      expect(screen.queryByTestId('hint-button')).not.toBeInTheDocument();
    });

    it('hides hint when game ends', () => {
      render(<Game />);

      // Show hint first
      const hintButton = screen.getByTestId('hint-button');
      fireEvent.click(hintButton);
      expect(screen.getByTestId('hint-display')).toBeInTheDocument();

      // Win the game
      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      expect(screen.queryByTestId('hint-display')).not.toBeInTheDocument();
    });
  });

  describe('Game State Management', () => {
    it('updates guesses when GuessInput changes them', () => {
      render(<Game />);

      expect(screen.getByText('Guesses:')).toBeInTheDocument();

      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      expect(screen.getByText('Guesses: TERRA')).toBeInTheDocument();
    });

    it('updates game over state when GuessInput sets it', () => {
      render(<Game />);

      const input = screen.getByTestId('guess-input-field');
      expect(input).not.toBeDisabled();

      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      expect(input).toBeDisabled();
    });

    it('shows banner when game is over', () => {
      render(<Game />);

      expect(screen.queryByTestId('banner')).not.toBeInTheDocument();

      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      expect(screen.getByTestId('banner')).toBeInTheDocument();
      expect(screen.getByText('Game Over: win')).toBeInTheDocument();
    });

    it('maintains backward compatibility with answer prop', () => {
      render(<Game />);

      // The answer should be passed to child components as the word
      expect(screen.getByText('Answer: TERRA')).toBeInTheDocument();
    });
  });

  describe('Reset Functionality', () => {
    it('resets all game state when reset is called', () => {
      render(<Game />);

      // Win the game first
      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      expect(screen.getByText('Guesses: TERRA')).toBeInTheDocument();
      expect(screen.getByTestId('banner')).toBeInTheDocument();

      // Mock sampleWord to return a different word for reset
      sampleWord.mockReturnValueOnce({
        word: 'AQUA',
        data: {
          meaning: 'water',
          part: 'noun',
        },
      });

      // Reset the game
      const resetButton = screen.getByTestId('reset-button');
      fireEvent.click(resetButton);

      expect(screen.getByText('Guesses:')).toBeInTheDocument();
      expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
      expect(screen.getByText('Answer: AQUA')).toBeInTheDocument();
    });

    it('gets new word when game is reset', () => {
      render(<Game />);

      // Win the game
      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      // Reset should call sampleWord again
      const initialCalls = sampleWord.mock.calls.length;

      const resetButton = screen.getByTestId('reset-button');
      fireEvent.click(resetButton);

      expect(sampleWord).toHaveBeenCalledTimes(initialCalls + 1);
    });

    it('resets hint state when game is reset', () => {
      render(<Game />);

      // Show hint
      const hintButton = screen.getByTestId('hint-button');
      fireEvent.click(hintButton);
      expect(screen.getByTestId('hint-display')).toBeInTheDocument();

      // Win the game
      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      // Reset the game
      const resetButton = screen.getByTestId('reset-button');
      fireEvent.click(resetButton);

      // Hint should be hidden and button should show "Show Hint"
      expect(screen.queryByTestId('hint-display')).not.toBeInTheDocument();
      expect(screen.getByTestId('hint-button')).toHaveTextContent('Show Hint');
    });
  });

  describe('Component Integration', () => {
    it('passes correct props to GuessResults', () => {
      render(<Game />);

      // Check that GuessResults receives answer and guesses
      expect(screen.getByText('Answer: TERRA')).toBeInTheDocument();
      expect(screen.getByText('Guesses:')).toBeInTheDocument();
    });

    it('passes correct props to GuessInput', () => {
      render(<Game />);

      const input = screen.getByTestId('guess-input-field');
      expect(input).not.toBeDisabled(); // gameOver should be false initially
    });

    it('passes correct props to Banner when game is over', () => {
      render(<Game />);

      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      expect(screen.getByText('Game Over: win')).toBeInTheDocument();
      expect(screen.getByText('Meaning: earth, land')).toBeInTheDocument();
    });

    it('maintains proper component hierarchy', () => {
      render(<Game />);

      // GuessResults should come before GuessInput in DOM order
      const allElements = screen.getAllByTestId(/guess-/);
      const resultsIndex = allElements.findIndex(
        el => el.getAttribute('data-testid') === 'guess-results'
      );
      const inputIndex = allElements.findIndex(
        el => el.getAttribute('data-testid') === 'guess-input'
      );

      expect(resultsIndex).toBeLessThan(inputIndex);
    });
  });

  describe('Layout and Styling', () => {
    it('renders hint section and input in flex container', () => {
      render(<Game />);

      const guessInput = screen.getByTestId('guess-input');
      const container = guessInput.parentElement; // GuessInput and HintSection are in flex container

      expect(container).toHaveStyle({
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '10px',
      });
    });

    it('positions components in correct order', () => {
      render(<Game />);

      const container = document.body;
      const elements = Array.from(container.querySelectorAll('[data-testid]'));

      const order = elements.map(el => el.getAttribute('data-testid'));
      expect(order.indexOf('guess-results')).toBeLessThan(
        order.indexOf('guess-input')
      );
    });
  });

  describe('Word Data Integration', () => {
    it('uses word data from sampleWord function', () => {
      const mockWordInfo = {
        word: 'MOTUM',
        data: {
          meaning: 'movement, motion',
          part: 'noun',
        },
      };
      sampleWord.mockReturnValue(mockWordInfo);

      render(<Game />);

      expect(screen.getByText('Answer: MOTUM')).toBeInTheDocument();
    });

    it('displays different word data in hint', () => {
      const mockWordInfo = {
        word: 'IGNIS',
        data: {
          meaning: 'fire, flame',
          part: 'noun',
        },
      };
      sampleWord.mockReturnValue(mockWordInfo);

      render(<Game />);

      const hintButton = screen.getByTestId('hint-button');
      fireEvent.click(hintButton);

      expect(screen.getByText('Hint: fire, flame (noun)')).toBeInTheDocument();
    });

    it('handles word data with different parts of speech', () => {
      const mockWordInfo = {
        word: 'AMARE',
        data: {
          meaning: 'to love',
          part: 'verb',
        },
      };
      sampleWord.mockReturnValue(mockWordInfo);

      render(<Game />);

      const hintButton = screen.getByTestId('hint-button');
      fireEvent.click(hintButton);

      expect(screen.getByText('Hint: to love (verb)')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing word data gracefully', () => {
      sampleWord.mockReturnValue({
        word: 'TERRA',
        data: null,
      });

      expect(() => {
        render(<Game />);
        // Try to show hint which would access wordInfo.data.meaning
        const hintButton = screen.getByText('Show Hint');
        fireEvent.click(hintButton);
      }).toThrow(); // This should throw since we access wordInfo.data.meaning
    });

    it('handles word data without meaning', () => {
      sampleWord.mockReturnValue({
        word: 'TERRA',
        data: {
          meaning: '',
          part: 'noun',
        },
      });

      render(<Game />);

      const hintButton = screen.getByTestId('hint-button');
      fireEvent.click(hintButton);

      expect(screen.getByText(/Hint:.*\(noun\)/)).toBeInTheDocument();
    });

    it('handles word data without part', () => {
      sampleWord.mockReturnValue({
        word: 'TERRA',
        data: {
          meaning: 'earth, land',
          part: '',
        },
      });

      render(<Game />);

      const hintButton = screen.getByTestId('hint-button');
      fireEvent.click(hintButton);

      expect(screen.getByText('Hint: earth, land ()')).toBeInTheDocument();
    });

    it('maintains game state consistency during rapid interactions', () => {
      render(<Game />);

      // Rapidly toggle hint
      const hintButton = screen.getByTestId('hint-button');
      fireEvent.click(hintButton);
      fireEvent.click(hintButton);
      fireEvent.click(hintButton);

      expect(screen.getByTestId('hint-display')).toBeInTheDocument();
      expect(hintButton).toHaveTextContent('Hide Hint');
    });
  });

  describe('State Persistence', () => {
    it('maintains hint state independent of game progression', () => {
      render(<Game />);

      // Show hint
      const hintButton = screen.getByTestId('hint-button');
      fireEvent.click(hintButton);

      // The hint should be visible
      expect(screen.getByTestId('hint-display')).toBeInTheDocument();

      // Hint should remain visible during normal gameplay
      expect(screen.getByTestId('hint-display')).toBeInTheDocument();
    });

    it('preserves game state across component updates', () => {
      render(<Game />);

      // Win the game
      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      // Game should remain in won state
      expect(screen.getByTestId('banner')).toBeInTheDocument();
      expect(screen.getByText('Game Over: win')).toBeInTheDocument();
    });
  });
});
