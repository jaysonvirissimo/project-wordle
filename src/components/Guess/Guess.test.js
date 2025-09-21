import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Guess from './Guess';

describe('Guess', () => {
  describe('when no guess is provided', () => {
    it('renders 5 empty cells', () => {
      const { container } = render(<Guess />);

      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(5);

      cells.forEach(cell => {
        expect(cell).toHaveClass('cell');
        expect(cell).not.toHaveClass('correct', 'misplaced', 'incorrect');
        expect(cell.textContent).toBe(' ');
      });
    });

    it('renders a paragraph with guess class', () => {
      const { container } = render(<Guess />);
      const guessElement = container.querySelector('.guess');

      expect(guessElement).toBeInTheDocument();
      expect(guessElement.tagName).toBe('P');
    });
  });

  describe('when a guess is provided', () => {
    const mockAnswer = 'LEARN';

    it('renders each letter in separate cells', () => {
      render(<Guess guess="HELLO" answer={mockAnswer} />);

      expect(screen.getByText('H')).toBeInTheDocument();
      expect(screen.getByText('E')).toBeInTheDocument();
      expect(screen.getAllByText('L')).toHaveLength(2);
      expect(screen.getByText('O')).toBeInTheDocument();
    });

    it('applies correct status classes based on game logic', () => {
      render(<Guess guess="WHALE" answer="LEARN" />);

      // W - incorrect (not in LEARN)
      const wCell = screen.getByText('W');
      expect(wCell).toHaveClass('cell', 'incorrect');

      // H - incorrect (not in LEARN)
      const hCell = screen.getByText('H');
      expect(hCell).toHaveClass('cell', 'incorrect');

      // A - correct (right letter, right position)
      const aCell = screen.getByText('A');
      expect(aCell).toHaveClass('cell', 'correct');

      // L - misplaced (in LEARN but wrong position)
      const lCell = screen.getByText('L');
      expect(lCell).toHaveClass('cell', 'misplaced');

      // E - misplaced (in LEARN but wrong position)
      const eCell = screen.getByText('E');
      expect(eCell).toHaveClass('cell', 'misplaced');
    });

    it('always renders exactly 5 cells for valid guesses', () => {
      const { container } = render(<Guess guess="HELLO" answer={mockAnswer} />);
      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(5);
    });

    it('handles perfect guess with all correct status', () => {
      const { container } = render(<Guess guess="LEARN" answer="LEARN" />);

      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(5);
      cells.forEach(cell => {
        expect(cell).toHaveClass('cell', 'correct');
      });
    });

    it('handles completely wrong guess with all incorrect status', () => {
      const { container } = render(<Guess guess="ZXCVB" answer="LEARN" />);

      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(5);
      cells.forEach(cell => {
        expect(cell).toHaveClass('cell', 'incorrect');
      });
    });

    it('handles duplicate letters correctly', () => {
      // Testing edge case where guess has duplicate letters
      const { container } = render(<Guess guess="LLAMA" answer="LEARN" />);

      const lCells = container.querySelectorAll('.cell');
      // First L should be correct (position 0 in LEARN)
      expect(lCells[0]).toHaveClass('cell', 'correct');
      expect(lCells[0].textContent).toBe('L');
      // Second L should be incorrect (only one L in LEARN, already matched)
      expect(lCells[1]).toHaveClass('cell', 'incorrect');
      expect(lCells[1].textContent).toBe('L');
    });
  });

  describe('component structure', () => {
    it('always renders a paragraph element with guess class', () => {
      const { container } = render(<Guess guess="HELLO" answer="LEARN" />);
      const guessElement = container.querySelector('p.guess');

      expect(guessElement).toBeInTheDocument();
    });

    it('renders span elements as direct children', () => {
      const { container } = render(<Guess guess="HELLO" answer="LEARN" />);
      const guessElement = container.querySelector('p.guess');
      const spans = guessElement.querySelectorAll('span');

      expect(spans).toHaveLength(5);
      spans.forEach(span => {
        expect(span.tagName).toBe('SPAN');
      });
    });
  });

  describe('edge cases', () => {
    it('handles empty string guess', () => {
      const { container } = render(<Guess guess="" answer="LEARN" />);

      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(5);
      cells.forEach(cell => {
        expect(cell.textContent).toBe(' ');
      });
    });

    it('handles null guess', () => {
      const { container } = render(<Guess guess={null} answer="LEARN" />);

      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(5);
      cells.forEach(cell => {
        expect(cell.textContent).toBe(' ');
      });
    });

    it('handles undefined guess', () => {
      const { container } = render(<Guess guess={undefined} answer="LEARN" />);

      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(5);
      cells.forEach(cell => {
        expect(cell.textContent).toBe(' ');
      });
    });

    it('requires answer prop when guess is provided', () => {
      // Component should crash if answer is missing when guess is provided
      // because checkGuess function expects both parameters
      expect(() => {
        render(<Guess guess="HELLO" />);
      }).toThrow();
    });

    it('works fine without answer when no guess provided', () => {
      // Component should not crash when no guess and no answer
      expect(() => {
        render(<Guess />);
      }).not.toThrow();
    });
  });
});
