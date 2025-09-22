import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HintSection from './HintSection';

describe('HintSection', () => {
  const defaultProps = {
    showHint: false,
    onToggleHint: jest.fn(),
    wordData: {
      meaning: 'earth, land',
      part: 'noun'
    },
    gameOver: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Visibility Logic', () => {
    it('renders nothing when game is over', () => {
      const { container } = render(<HintSection {...defaultProps} gameOver={true} />);

      expect(container.firstChild).toBeNull();
    });

    it('renders hint button when game is not over', () => {
      render(<HintSection {...defaultProps} gameOver={false} />);

      const button = screen.getByRole('button', { name: /show hint/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Hint Button', () => {
    it('displays "Show Hint" when hint is hidden', () => {
      render(<HintSection {...defaultProps} showHint={false} />);

      expect(screen.getByText('Show Hint')).toBeInTheDocument();
    });

    it('displays "Hide Hint" when hint is shown', () => {
      render(<HintSection {...defaultProps} showHint={true} />);

      expect(screen.getByText('Hide Hint')).toBeInTheDocument();
    });

    it('calls onToggleHint when clicked', () => {
      const onToggleHint = jest.fn();
      render(<HintSection {...defaultProps} onToggleHint={onToggleHint} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(onToggleHint).toHaveBeenCalledTimes(1);
    });

    it('has correct styling', () => {
      render(<HintSection {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        padding: '8px 12px',
        cursor: 'pointer'
      });
    });
  });

  describe('Hint Display', () => {
    it('shows hint content when showHint is true', () => {
      render(<HintSection {...defaultProps} showHint={true} />);

      expect(screen.getByText('Hint:')).toBeInTheDocument();
      expect(screen.getByText('earth, land (noun)')).toBeInTheDocument();
    });

    it('hides hint content when showHint is false', () => {
      render(<HintSection {...defaultProps} showHint={false} />);

      expect(screen.queryByText('Hint:')).not.toBeInTheDocument();
      expect(screen.queryByText('earth, land (noun)')).not.toBeInTheDocument();
    });

    it('displays correct hint content', () => {
      const wordData = { meaning: 'fire, flame', part: 'noun' };
      render(<HintSection {...defaultProps} showHint={true} wordData={wordData} />);

      expect(screen.getByText('fire, flame (noun)')).toBeInTheDocument();
    });

    it('has correct styling for hint container', () => {
      render(<HintSection {...defaultProps} showHint={true} />);

      const hintContainer = screen.getByText('Hint:').parentElement;
      expect(hintContainer).toHaveStyle({
        textAlign: 'center',
        margin: '10px 0',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px'
      });
    });
  });

  describe('Word Data Integration', () => {
    it('handles different parts of speech', () => {
      const wordData = { meaning: 'to love', part: 'verb' };
      render(<HintSection {...defaultProps} showHint={true} wordData={wordData} />);

      expect(screen.getByText('to love (verb)')).toBeInTheDocument();
    });

    it('handles empty meaning', () => {
      const wordData = { meaning: '', part: 'noun' };
      render(<HintSection {...defaultProps} showHint={true} wordData={wordData} />);

      expect(screen.getByText('(noun)')).toBeInTheDocument();
    });

    it('handles empty part', () => {
      const wordData = { meaning: 'test meaning', part: '' };
      render(<HintSection {...defaultProps} showHint={true} wordData={wordData} />);

      expect(screen.getByText('test meaning ()')).toBeInTheDocument();
    });

    it('handles missing wordData gracefully', () => {
      expect(() => {
        render(<HintSection {...defaultProps} showHint={true} wordData={null} />);
      }).toThrow(); // Should throw since we access wordData.meaning
    });
  });

  describe('State Changes', () => {
    it('updates button text when showHint prop changes', () => {
      const { rerender } = render(<HintSection {...defaultProps} showHint={false} />);

      expect(screen.getByText('Show Hint')).toBeInTheDocument();

      rerender(<HintSection {...defaultProps} showHint={true} />);

      expect(screen.getByText('Hide Hint')).toBeInTheDocument();
    });

    it('updates hint visibility when showHint prop changes', () => {
      const { rerender } = render(<HintSection {...defaultProps} showHint={false} />);

      expect(screen.queryByText('Hint:')).not.toBeInTheDocument();

      rerender(<HintSection {...defaultProps} showHint={true} />);

      expect(screen.getByText('Hint:')).toBeInTheDocument();
    });

    it('updates hint content when wordData prop changes', () => {
      const initialWordData = { meaning: 'initial', part: 'noun' };
      const { rerender } = render(<HintSection {...defaultProps} showHint={true} wordData={initialWordData} />);

      expect(screen.getByText('initial (noun)')).toBeInTheDocument();

      const updatedWordData = { meaning: 'updated', part: 'verb' };
      rerender(<HintSection {...defaultProps} showHint={true} wordData={updatedWordData} />);

      expect(screen.queryByText('initial (noun)')).not.toBeInTheDocument();
      expect(screen.getByText('updated (verb)')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders as React Fragment when visible', () => {
      const { container } = render(<HintSection {...defaultProps} />);

      // Should not add extra wrapper elements
      expect(container.children).toHaveLength(1);
      expect(container.firstChild.tagName).toBe('BUTTON');
    });

    it('maintains correct DOM order', () => {
      render(<HintSection {...defaultProps} showHint={true} />);

      const button = screen.getByRole('button');
      const hintDiv = screen.getByText('Hint:').parentElement;

      // Button should come before hint content in DOM
      expect(button.nextSibling).toBe(hintDiv);
    });
  });

  describe('Accessibility', () => {
    it('button is accessible via keyboard', () => {
      render(<HintSection {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('hint content is properly structured', () => {
      render(<HintSection {...defaultProps} showHint={true} />);

      const hintLabel = screen.getByText('Hint:');
      expect(hintLabel.tagName).toBe('STRONG');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid toggle interactions', () => {
      const onToggleHint = jest.fn();
      render(<HintSection {...defaultProps} onToggleHint={onToggleHint} />);

      const button = screen.getByRole('button');

      // Rapid clicks
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(onToggleHint).toHaveBeenCalledTimes(3);
    });

    it('handles undefined onToggleHint gracefully', () => {
      expect(() => {
        render(<HintSection {...defaultProps} onToggleHint={undefined} />);
      }).not.toThrow();
    });
  });
});
