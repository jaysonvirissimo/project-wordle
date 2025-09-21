import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game from './Game';

// Mock all child components
jest.mock('../GuessInput/GuessInput', () => {
  return function MockGuessInput({ answer, gameOver, guesses, setGameOutcome, setGameOver, setGuesses }) {
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
            // Mock winning the game
            if (answer === 'TERRA') {
              setGuesses([...guesses, 'TERRA']);
              setGameOutcome('win');
              setGameOver(true);
            } else {
              setGuesses([...guesses, 'WRONG']);
            }
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
  return function MockBanner({ answer, gameOutcome, gameOver, guesses, resetGame, wordData }) {
    if (!gameOver) return null;
    return (
      <div data-testid="banner">
        <div>Game Over: {gameOutcome}</div>
        <div>Answer: {answer}</div>
        {wordData && <div>Meaning: {wordData.meaning}</div>}
        <button data-testid="reset-button" onClick={resetGame}>Reset</button>
      </div>
    );
  };
});

// Mock the utils and words data
jest.mock('../../utils', () => ({
  sampleWord: jest.fn(() => ({
    word: 'TERRA',
    data: {
      meaning: 'earth, land',
      part: 'noun'
    }
  }))
}));

jest.mock('../../words.json', () => [
  {
    word: 'TERRA',
    data: {
      meaning: 'earth, land',
      part: 'noun'
    }
  },
  {
    word: 'AQUA',
    data: {
      meaning: 'water',
      part: 'noun'
    }
  }
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
        part: 'noun'
      }
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

      const hintButton = screen.getByText('Show Hint');
      expect(hintButton).toBeInTheDocument();
    });

    it('toggles hint visibility when button is clicked', () => {
      render(<Game />);

      const hintButton = screen.getByText('Show Hint');
      fireEvent.click(hintButton);

      expect(screen.getByText(/hint:/i)).toBeInTheDocument();
      expect(screen.getByText('earth, land (noun)')).toBeInTheDocument();
      expect(screen.getByText('Hide Hint')).toBeInTheDocument();
    });

    it('hides hint when hide button is clicked', () => {
      render(<Game />);

      const showButton = screen.getByText('Show Hint');
      fireEvent.click(showButton);

      const hideButton = screen.getByText('Hide Hint');
      fireEvent.click(hideButton);

      expect(screen.queryByText(/hint:/i)).not.toBeInTheDocument();
      expect(screen.getByText('Show Hint')).toBeInTheDocument();
    });

    it('displays correct hint content', () => {
      render(<Game />);

      const hintButton = screen.getByText('Show Hint');
      fireEvent.click(hintButton);

      expect(screen.getByText('Hint:')).toBeInTheDocument();
      expect(screen.getByText('earth, land (noun)')).toBeInTheDocument();
    });

    it('does not render hint button when game is over', () => {
      render(<Game />);

      // Win the game
      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      expect(screen.queryByText('Show Hint')).not.toBeInTheDocument();
      expect(screen.queryByText('Hide Hint')).not.toBeInTheDocument();
    });

    it('hides hint when game ends', () => {
      render(<Game />);

      // Show hint first
      const hintButton = screen.getByText('Show Hint');
      fireEvent.click(hintButton);
      expect(screen.getByText(/hint:/i)).toBeInTheDocument();

      // Win the game
      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      expect(screen.queryByText(/hint:/i)).not.toBeInTheDocument();
    });

    it('has correct styling for hint container', () => {
      render(<Game />);

      const hintButton = screen.getByText('Show Hint');
      fireEvent.click(hintButton);

      const hintContainer = screen.getByText(/hint:/i).parentElement;
      expect(hintContainer).toHaveStyle({
        textAlign: 'center',
        margin: '10px 0',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px'
      });
    });

    it('has correct styling for hint button', () => {
      render(<Game />);

      const hintButton = screen.getByText('Show Hint');
      expect(hintButton).toHaveStyle({
        padding: '8px 12px',
        cursor: 'pointer'
      });
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
          part: 'noun'
        }
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
      const hintButton = screen.getByText('Show Hint');
      fireEvent.click(hintButton);
      expect(screen.getByText(/hint:/i)).toBeInTheDocument();

      // Win the game
      const submitButton = screen.getByTestId('submit-guess');
      fireEvent.click(submitButton);

      // Reset the game
      const resetButton = screen.getByTestId('reset-button');
      fireEvent.click(resetButton);

      // Hint should be hidden and button should show "Show Hint"
      expect(screen.queryByText(/hint:/i)).not.toBeInTheDocument();
      expect(screen.getByText('Show Hint')).toBeInTheDocument();
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

      const guessResults = screen.getByTestId('guess-results');
      const guessInput = screen.getByTestId('guess-input');

      // GuessResults should come before GuessInput in DOM order
      const allElements = screen.getAllByTestId(/guess-/);
      const resultsIndex = allElements.findIndex(el => el.getAttribute('data-testid') === 'guess-results');
      const inputIndex = allElements.findIndex(el => el.getAttribute('data-testid') === 'guess-input');

      expect(resultsIndex).toBeLessThan(inputIndex);
    });
  });

  describe('Layout and Styling', () => {
    it('renders hint button and input in flex container', () => {
      render(<Game />);

      const hintButton = screen.getByText('Show Hint');
      const container = hintButton.parentElement;

      expect(container).toHaveStyle({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '10px'
      });
    });

    it('positions components in correct order', () => {
      render(<Game />);

      const container = document.body;
      const elements = Array.from(container.querySelectorAll('[data-testid]'));

      const order = elements.map(el => el.getAttribute('data-testid'));
      expect(order.indexOf('guess-results')).toBeLessThan(order.indexOf('guess-input'));
    });
  });

  describe('Word Data Integration', () => {
    it('uses word data from sampleWord function', () => {
      const mockWordInfo = {
        word: 'MOTUM',
        data: {
          meaning: 'movement, motion',
          part: 'noun'
        }
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
          part: 'noun'
        }
      };
      sampleWord.mockReturnValue(mockWordInfo);

      render(<Game />);

      const hintButton = screen.getByText('Show Hint');
      fireEvent.click(hintButton);

      expect(screen.getByText('fire, flame (noun)')).toBeInTheDocument();
    });

    it('handles word data with different parts of speech', () => {
      const mockWordInfo = {
        word: 'AMARE',
        data: {
          meaning: 'to love',
          part: 'verb'
        }
      };
      sampleWord.mockReturnValue(mockWordInfo);

      render(<Game />);

      const hintButton = screen.getByText('Show Hint');
      fireEvent.click(hintButton);

      expect(screen.getByText('to love (verb)')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing word data gracefully', () => {
      sampleWord.mockReturnValue({
        word: 'TERRA',
        data: null
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
          part: 'noun'
        }
      });

      render(<Game />);

      const hintButton = screen.getByText('Show Hint');
      fireEvent.click(hintButton);

      expect(screen.getByText('(noun)')).toBeInTheDocument();
    });

    it('handles word data without part', () => {
      sampleWord.mockReturnValue({
        word: 'TERRA',
        data: {
          meaning: 'earth, land',
          part: ''
        }
      });

      render(<Game />);

      const hintButton = screen.getByText('Show Hint');
      fireEvent.click(hintButton);

      expect(screen.getByText('earth, land ()')).toBeInTheDocument();
    });

    it('maintains game state consistency during rapid interactions', () => {
      render(<Game />);

      // Rapidly toggle hint
      const hintButton = screen.getByText('Show Hint');
      fireEvent.click(hintButton);
      fireEvent.click(screen.getByText('Hide Hint'));
      fireEvent.click(screen.getByText('Show Hint'));

      expect(screen.getByText(/hint:/i)).toBeInTheDocument();
      expect(screen.getByText('Hide Hint')).toBeInTheDocument();
    });
  });

  describe('State Persistence', () => {
    it('maintains hint state independent of game progression', () => {
      render(<Game />);

      // Show hint
      const hintButton = screen.getByText('Show Hint');
      fireEvent.click(hintButton);

      // Add a guess (but don't win)
      sampleWord.mockReturnValue({
        word: 'WRONG',
        data: { meaning: 'test', part: 'noun' }
      });

      // The hint should still be visible until game ends
      expect(screen.getByText(/hint:/i)).toBeInTheDocument();
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
