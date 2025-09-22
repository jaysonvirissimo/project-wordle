import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GuessInput from './GuessInput';

// Mock the game helpers and utils
jest.mock('../../game-helpers', () => ({
  checkGuess: jest.fn(),
}));

jest.mock('../../utils/normalize', () => ({
  normalizeDiacritics: jest.fn((text) => text.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')),
}));

const { checkGuess } = require('../../game-helpers');
const { normalizeDiacritics } = require('../../utils/normalize');

describe('GuessInput', () => {
  // Default props for testing
  const defaultProps = {
    gameOver: false,
    onGuessSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Structure', () => {
    it('renders form with correct structure', () => {
      const { container } = render(<GuessInput {...defaultProps} />);

      const form = container.querySelector('form.guess-input-wrapper');
      expect(form).toBeInTheDocument();

      const label = screen.getByLabelText('Enter guess:');
      expect(label).toBeInTheDocument();

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'guess-input');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('maxLength', '5');
      expect(input).toHaveAttribute('minLength', '5');
    });

    it('associates label with input correctly', () => {
      render(<GuessInput {...defaultProps} />);

      const label = screen.getByText('Enter guess:');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'guess-input');
      expect(input).toHaveAttribute('id', 'guess-input');
    });

    it('disables input when game is over', () => {
      render(<GuessInput {...defaultProps} gameOver={true} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('enables input when game is not over', () => {
      render(<GuessInput {...defaultProps} gameOver={false} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toBeDisabled();
    });
  });

  describe('Input Handling', () => {
    it('updates input value when user types', async () => {
      const user = userEvent.setup();
      render(<GuessInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'hello');

      expect(input).toHaveValue('hello');
    });

    it('handles diacritic input correctly', async () => {
      const user = userEvent.setup();
      render(<GuessInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'mōtum');

      expect(input).toHaveValue('mōtum');
    });

    it('respects maxLength constraint', async () => {
      const user = userEvent.setup();
      render(<GuessInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'toolong');

      // Should only allow 5 characters
      expect(input.value.length).toBeLessThanOrEqual(5);
    });

    it('clears input after successful submission', async () => {
      const user = userEvent.setup();
      checkGuess.mockReturnValue([
        { status: 'incorrect' },
        { status: 'incorrect' },
        { status: 'incorrect' },
        { status: 'incorrect' },
        { status: 'incorrect' },
      ]);

      render(<GuessInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'hello');

      fireEvent.submit(input.closest('form'));
      expect(input).toHaveValue('');
    });
  });

  describe('Form Submission', () => {
    it('prevents default form submission', () => {
      render(<GuessInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      const form = input.closest('form');

      // Create a mock event that tracks preventDefault calls
      const mockEvent = new Event('submit', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(mockEvent, 'preventDefault');

      fireEvent(form, mockEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      preventDefaultSpy.mockRestore();
    });

    it('normalizes guess before processing', async () => {
      const user = userEvent.setup();
      const onGuessSubmit = jest.fn();

      render(<GuessInput {...defaultProps} onGuessSubmit={onGuessSubmit} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'mōtum');
      fireEvent.submit(input.closest('form'));

      expect(normalizeDiacritics).toHaveBeenCalledWith('mōtum');
      expect(onGuessSubmit).toHaveBeenCalledWith('MOTUM');
    });

    it('calls onGuessSubmit with normalized guess', async () => {
      const user = userEvent.setup();
      const onGuessSubmit = jest.fn();

      render(<GuessInput {...defaultProps} onGuessSubmit={onGuessSubmit} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'hello');
      fireEvent.submit(input.closest('form'));

      expect(onGuessSubmit).toHaveBeenCalledWith('HELLO');
    });

  });


  describe('Callback Integration', () => {
    it('calls onGuessSubmit with normalized guess', async () => {
      const user = userEvent.setup();
      const onGuessSubmit = jest.fn();

      render(<GuessInput {...defaultProps} onGuessSubmit={onGuessSubmit} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'hello');
      fireEvent.submit(input.closest('form'));

      expect(onGuessSubmit).toHaveBeenCalledWith('HELLO');
    });

    it('handles diacritic normalization in callback', async () => {
      const user = userEvent.setup();
      const onGuessSubmit = jest.fn();

      render(<GuessInput {...defaultProps} onGuessSubmit={onGuessSubmit} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'mōtum');
      fireEvent.submit(input.closest('form'));

      expect(onGuessSubmit).toHaveBeenCalledWith('MOTUM');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty input submission gracefully', () => {
      const { container } = render(<GuessInput {...defaultProps} />);

      const form = container.querySelector('form');
      expect(() => {
        fireEvent.submit(form);
      }).not.toThrow();
    });

    it('handles missing onGuessSubmit gracefully', () => {
      expect(() => {
        render(<GuessInput gameOver={false} />);
      }).not.toThrow();
    });

    it('does not affect guess submission when input is disabled', async () => {
      const user = userEvent.setup();
      const onGuessSubmit = jest.fn();
      const { container } = render(<GuessInput {...defaultProps} gameOver={true} onGuessSubmit={onGuessSubmit} />);

      const input = screen.getByRole('textbox');
      const form = container.querySelector('form');

      // Try to type (should not work since input is disabled)
      await user.type(input, 'hello');

      // Verify input is disabled and value is empty
      expect(input).toBeDisabled();
      expect(input).toHaveValue('');

      // Form submission still works but with empty value
      fireEvent.submit(form);

      // onGuessSubmit should be called with normalized empty string
      expect(onGuessSubmit).toHaveBeenCalledWith('');
    });
  });

  describe('State Management', () => {
    it('maintains input state independently of parent re-renders', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<GuessInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      // Re-render with same props
      rerender(<GuessInput {...defaultProps} />);

      // Input should still maintain its local state
      expect(input).toHaveValue('test');
    });

    it('resets input value after form submission', async () => {
      const user = userEvent.setup();
      const onGuessSubmit = jest.fn();

      render(<GuessInput {...defaultProps} onGuessSubmit={onGuessSubmit} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'hello');

      expect(input).toHaveValue('hello');

      fireEvent.submit(input.closest('form'));

      expect(input).toHaveValue('');
    });
  });
});
