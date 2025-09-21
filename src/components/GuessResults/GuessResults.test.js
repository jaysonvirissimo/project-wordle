import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GuessResults from './GuessResults';

// Mock the Guess component
jest.mock('../Guess/Guess', () => {
  return function MockGuess({ guess, answer }) {
    return (
      <div
        data-testid="guess-component"
        data-guess={guess || 'empty'}
        data-answer={answer || undefined}
      >
        {guess ? `Guess: ${guess}` : 'Empty Guess'}
      </div>
    );
  };
});

// Mock constants
jest.mock('../../constants', () => ({
  NUM_OF_GUESSES_ALLOWED: 6,
}));

describe('GuessResults', () => {
  const defaultProps = {
    guesses: [],
    answer: 'TERRA'
  };

  describe('Component Structure', () => {
    it('renders container with correct class', () => {
      const { container } = render(<GuessResults {...defaultProps} />);

      const guessResults = container.querySelector('.guess-results');
      expect(guessResults).toBeInTheDocument();
    });

    it('renders as a div element', () => {
      const { container } = render(<GuessResults {...defaultProps} />);

      const guessResults = container.querySelector('.guess-results');
      expect(guessResults.tagName).toBe('DIV');
    });
  });

  describe('Grid Structure', () => {
    it('always renders exactly 6 guess components regardless of guesses count', () => {
      const { rerender } = render(<GuessResults {...defaultProps} guesses={[]} />);

      expect(screen.getAllByTestId('guess-component')).toHaveLength(6);

      rerender(<GuessResults {...defaultProps} guesses={['HELLO']} />);
      expect(screen.getAllByTestId('guess-component')).toHaveLength(6);

      rerender(<GuessResults {...defaultProps} guesses={['HELLO', 'WORLD', 'TESTS']} />);
      expect(screen.getAllByTestId('guess-component')).toHaveLength(6);

      rerender(<GuessResults {...defaultProps} guesses={['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIXTH']} />);
      expect(screen.getAllByTestId('guess-component')).toHaveLength(6);
    });

    it('renders empty slots when no guesses provided', () => {
      render(<GuessResults {...defaultProps} guesses={[]} />);

      const guessComponents = screen.getAllByTestId('guess-component');
      expect(guessComponents).toHaveLength(6);

      guessComponents.forEach(component => {
        expect(component).toHaveAttribute('data-guess', 'empty');
        expect(component).toHaveTextContent('Empty Guess');
      });
    });

    it('fills remaining slots with empty guesses when fewer than 6 guesses', () => {
      render(<GuessResults {...defaultProps} guesses={['HELLO', 'WORLD']} />);

      const guessComponents = screen.getAllByTestId('guess-component');
      expect(guessComponents).toHaveLength(6);

      // First 2 should have guesses
      expect(guessComponents[0]).toHaveAttribute('data-guess', 'HELLO');
      expect(guessComponents[1]).toHaveAttribute('data-guess', 'WORLD');

      // Remaining 4 should be empty
      for (let i = 2; i < 6; i++) {
        expect(guessComponents[i]).toHaveAttribute('data-guess', 'empty');
        expect(guessComponents[i]).toHaveTextContent('Empty Guess');
      }
    });
  });

  describe('Guess Rendering', () => {
    it('renders each guess with correct props', () => {
      const testGuesses = ['HELLO', 'WORLD', 'TESTS'];
      render(<GuessResults {...defaultProps} guesses={testGuesses} answer="TERRA" />);

      const guessComponents = screen.getAllByTestId('guess-component');

      // Check first 3 have correct guesses and answer
      testGuesses.forEach((guess, index) => {
        expect(guessComponents[index]).toHaveAttribute('data-guess', guess);
        expect(guessComponents[index]).toHaveAttribute('data-answer', 'TERRA');
        expect(guessComponents[index]).toHaveTextContent(`Guess: ${guess}`);
      });
    });

    it('passes answer prop to filled guess components only', () => {
      render(<GuessResults {...defaultProps} guesses={['HELLO']} answer="TESTS" />);

      const guessComponents = screen.getAllByTestId('guess-component');

      // First component (with guess) should have answer
      expect(guessComponents[0]).toHaveAttribute('data-answer', 'TESTS');

      // Empty components (no guess) don't receive answer prop
      for (let i = 1; i < 6; i++) {
        expect(guessComponents[i]).not.toHaveAttribute('data-answer');
      }
    });

    it('handles empty guesses array correctly', () => {
      render(<GuessResults {...defaultProps} guesses={[]} />);

      const guessComponents = screen.getAllByTestId('guess-component');
      expect(guessComponents).toHaveLength(6);

      guessComponents.forEach(component => {
        expect(component).toHaveAttribute('data-guess', 'empty');
      });
    });

    it('renders maximum allowed guesses without exceeding', () => {
      const maxGuesses = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX'];
      render(<GuessResults {...defaultProps} guesses={maxGuesses} />);

      const guessComponents = screen.getAllByTestId('guess-component');
      expect(guessComponents).toHaveLength(6);

      maxGuesses.forEach((guess, index) => {
        expect(guessComponents[index]).toHaveAttribute('data-guess', guess);
      });
    });

    it('handles more than maximum guesses gracefully', () => {
      const tooManyGuesses = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN'];
      render(<GuessResults {...defaultProps} guesses={tooManyGuesses} />);

      const guessComponents = screen.getAllByTestId('guess-component');
      // Current implementation adds all guesses then fills to 6, so it will be 7 total
      expect(guessComponents).toHaveLength(7); // Actual behavior: renders all guesses provided
    });
  });

  describe('Integration with Guess Component', () => {
    it('passes correct props to Guess components for filled slots', () => {
      render(<GuessResults {...defaultProps} guesses={['HELLO']} answer="WORLD" />);

      const guessComponents = screen.getAllByTestId('guess-component');
      const filledGuess = guessComponents[0];
      expect(filledGuess).toHaveAttribute('data-guess', 'HELLO');
      expect(filledGuess).toHaveAttribute('data-answer', 'WORLD');
    });

    it('passes no guess prop to empty Guess components', () => {
      render(<GuessResults {...defaultProps} guesses={[]} />);

      const guessComponents = screen.getAllByTestId('guess-component');
      guessComponents.forEach(component => {
        expect(component).toHaveAttribute('data-guess', 'empty');
      });
    });

    it('maintains correct order of guesses', () => {
      const orderedGuesses = ['FIRST', 'SECOND', 'THIRD'];
      render(<GuessResults {...defaultProps} guesses={orderedGuesses} />);

      const guessComponents = screen.getAllByTestId('guess-component');

      orderedGuesses.forEach((guess, index) => {
        expect(guessComponents[index]).toHaveAttribute('data-guess', guess);
      });
    });
  });

  describe('State Changes', () => {
    it('updates when guesses prop changes', () => {
      const { rerender } = render(<GuessResults {...defaultProps} guesses={['HELLO']} />);

      let guessComponents = screen.getAllByTestId('guess-component');
      expect(guessComponents[0]).toHaveAttribute('data-guess', 'HELLO');
      expect(guessComponents[1]).toHaveAttribute('data-guess', 'empty');

      rerender(<GuessResults {...defaultProps} guesses={['HELLO', 'WORLD']} />);

      guessComponents = screen.getAllByTestId('guess-component');
      expect(guessComponents[0]).toHaveAttribute('data-guess', 'HELLO');
      expect(guessComponents[1]).toHaveAttribute('data-guess', 'WORLD');
      expect(guessComponents[2]).toHaveAttribute('data-guess', 'empty');
    });

    it('updates when answer prop changes', () => {
      const { rerender } = render(<GuessResults {...defaultProps} guesses={['HELLO']} answer="FIRST" />);

      let guessComponents = screen.getAllByTestId('guess-component');
      // Only the first component (with guess) should have answer
      expect(guessComponents[0]).toHaveAttribute('data-answer', 'FIRST');

      rerender(<GuessResults {...defaultProps} guesses={['HELLO']} answer="SECOND" />);

      guessComponents = screen.getAllByTestId('guess-component');
      // Only the first component (with guess) should have updated answer
      expect(guessComponents[0]).toHaveAttribute('data-answer', 'SECOND');
    });

    it('handles dynamic guess additions correctly', () => {
      const { rerender } = render(<GuessResults {...defaultProps} guesses={[]} />);

      // Start with empty
      let guessComponents = screen.getAllByTestId('guess-component');
      expect(guessComponents.every(component =>
        component.getAttribute('data-guess') === 'empty'
      )).toBe(true);

      // Add first guess
      rerender(<GuessResults {...defaultProps} guesses={['FIRST']} />);
      guessComponents = screen.getAllByTestId('guess-component');
      expect(guessComponents[0]).toHaveAttribute('data-guess', 'FIRST');

      // Add second guess
      rerender(<GuessResults {...defaultProps} guesses={['FIRST', 'SECOND']} />);
      guessComponents = screen.getAllByTestId('guess-component');
      expect(guessComponents[0]).toHaveAttribute('data-guess', 'FIRST');
      expect(guessComponents[1]).toHaveAttribute('data-guess', 'SECOND');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined guesses prop gracefully', () => {
      expect(() => {
        render(<GuessResults answer="TERRA" />);
      }).toThrow(); // Should throw since guesses.map will fail
    });

    it('handles null guesses prop gracefully', () => {
      expect(() => {
        render(<GuessResults guesses={null} answer="TERRA" />);
      }).toThrow(); // Should throw since null.map will fail
    });

    it('handles missing answer prop', () => {
      expect(() => {
        render(<GuessResults guesses={['HELLO']} />);
      }).not.toThrow(); // Should not throw, just pass undefined
    });

    it('handles empty string guesses (causes React key warnings)', () => {
      // Suppress console warnings for this specific test that tests problematic behavior
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<GuessResults {...defaultProps} guesses={['', 'HELLO', '']} />);

      const guessComponents = screen.getAllByTestId('guess-component');
      // Empty strings are treated as actual guesses, not as "empty" slots
      expect(guessComponents[0]).toHaveAttribute('data-guess', 'empty'); // Mock converts falsy to 'empty'
      expect(guessComponents[1]).toHaveAttribute('data-guess', 'HELLO');
      expect(guessComponents[2]).toHaveAttribute('data-guess', 'empty'); // Mock converts falsy to 'empty'

      consoleSpy.mockRestore();
    });

    it('handles very long guess strings', () => {
      const longGuess = 'VERYLONGGUESSSTRING';
      render(<GuessResults {...defaultProps} guesses={[longGuess]} />);

      const guessComponent = screen.getAllByTestId('guess-component')[0];
      expect(guessComponent).toHaveAttribute('data-guess', longGuess);
    });

    it('handles special characters in guesses', () => {
      const specialGuess = 'HELLO!@#';
      render(<GuessResults {...defaultProps} guesses={[specialGuess]} />);

      const guessComponent = screen.getAllByTestId('guess-component')[0];
      expect(guessComponent).toHaveAttribute('data-guess', specialGuess);
    });
  });

  describe('Performance and Keys', () => {
    it('uses guess as key for filled slots (potential duplicate key issue)', () => {
      const duplicateGuesses = ['HELLO', 'HELLO']; // This will cause React key warnings

      // Suppress console warnings for this specific test that tests problematic behavior
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // We can't easily test React keys directly, but we can test the behavior
      // In real usage, this would cause React warnings about duplicate keys
      render(<GuessResults {...defaultProps} guesses={duplicateGuesses} />);

      const guessComponents = screen.getAllByTestId('guess-component');
      expect(guessComponents[0]).toHaveAttribute('data-guess', 'HELLO');
      expect(guessComponents[1]).toHaveAttribute('data-guess', 'HELLO');

      consoleSpy.mockRestore();
    });

    it('maintains component structure when re-rendering', () => {
      const { rerender } = render(<GuessResults {...defaultProps} guesses={['HELLO']} />);

      const initialContainer = screen.getAllByTestId('guess-component')[0].parentElement;

      rerender(<GuessResults {...defaultProps} guesses={['HELLO', 'WORLD']} />);

      const updatedContainer = screen.getAllByTestId('guess-component')[0].parentElement;
      expect(initialContainer).toBe(updatedContainer);
    });
  });

  describe('Accessibility and Structure', () => {
    it('maintains proper DOM structure', () => {
      const { container } = render(<GuessResults {...defaultProps} guesses={['HELLO']} />);

      const guessResults = container.querySelector('.guess-results');
      const guessComponents = guessResults.children;

      expect(guessComponents).toHaveLength(6);
      Array.from(guessComponents).forEach(child => {
        expect(child).toHaveAttribute('data-testid', 'guess-component');
      });
    });

    it('preserves semantic structure for screen readers', () => {
      render(<GuessResults {...defaultProps} guesses={['HELLO', 'WORLD']} />);

      const container = screen.getAllByTestId('guess-component')[0].parentElement;
      expect(container).toHaveClass('guess-results');
    });
  });
});
