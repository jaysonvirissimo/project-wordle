import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Banner from './Banner';

describe('Banner', () => {
  const defaultProps = {
    answer: 'TERRA',
    gameOutcome: 'win',
    gameOver: true,
    guesses: ['HELLO', 'WORLD', 'TERRA'],
    resetGame: jest.fn(),
    wordData: {
      meaning: 'earth, land',
      part: 'noun'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Visibility Logic', () => {
    it('renders nothing when game is not over', () => {
      const { container } = render(<Banner {...defaultProps} gameOver={false} />);

      expect(container.firstChild).toBeNull();
    });

    it('renders banner when game is over', () => {
      render(<Banner {...defaultProps} gameOver={true} />);

      const banner = screen.getByRole('button', { name: /reset game/i }).closest('.banner');
      expect(banner).toBeInTheDocument();
    });
  });

  describe('Win Banner', () => {
    it('renders win banner with correct styling', () => {
      render(<Banner {...defaultProps} gameOutcome="win" />);

      const banner = screen.getByRole('button', { name: /reset game/i }).closest('.banner');
      expect(banner).toHaveClass('happy', 'banner');
    });

    it('displays congratulations message with guess count', () => {
      render(<Banner {...defaultProps} gameOutcome="win" guesses={['ONE', 'TWO']} />);

      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      expect(screen.getByText(/got it in/i)).toBeInTheDocument();
      expect(screen.getByText(/2 guesses/i)).toBeInTheDocument();
    });

    it('displays word meaning when wordData is provided', () => {
      const wordData = { meaning: 'water', part: 'noun' };
      render(<Banner {...defaultProps} gameOutcome="win" answer="AQUA" wordData={wordData} />);

      expect(screen.getByText('AQUA')).toBeInTheDocument();
      expect(screen.getByText(/means "water"/)).toBeInTheDocument();
      expect(screen.getByText(/\(noun\)/)).toBeInTheDocument();
    });

    it('does not display word meaning when wordData is null', () => {
      render(<Banner {...defaultProps} gameOutcome="win" wordData={null} />);

      expect(screen.queryByText(/means/)).not.toBeInTheDocument();
    });

    it('does not display word meaning when wordData is undefined', () => {
      render(<Banner {...defaultProps} gameOutcome="win" wordData={undefined} />);

      expect(screen.queryByText(/means/)).not.toBeInTheDocument();
    });

    it('handles singular guess correctly', () => {
      render(<Banner {...defaultProps} gameOutcome="win" guesses={['TERRA']} />);

      expect(screen.getByText(/1 guesses/i)).toBeInTheDocument();
    });

    it('handles multiple guesses correctly', () => {
      render(<Banner {...defaultProps} gameOutcome="win" guesses={['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE']} />);

      expect(screen.getByText(/5 guesses/i)).toBeInTheDocument();
    });
  });

  describe('Lose Banner', () => {
    it('renders lose banner with correct styling', () => {
      render(<Banner {...defaultProps} gameOutcome="lose" />);

      const banner = screen.getByRole('button', { name: /reset game/i }).closest('.banner');
      expect(banner).toHaveClass('sad', 'banner');
    });

    it('displays sorry message with correct answer', () => {
      render(<Banner {...defaultProps} gameOutcome="lose" answer="MOTUM" />);

      expect(screen.getByText(/sorry, the correct answer is/i)).toBeInTheDocument();
      expect(screen.getByText('MOTUM')).toBeInTheDocument();
    });

    it('displays word meaning when wordData is provided', () => {
      const wordData = { meaning: 'movement, motion', part: 'noun' };
      render(<Banner {...defaultProps} gameOutcome="lose" answer="MOTUM" wordData={wordData} />);

      expect(screen.getByText(/means "movement, motion"/)).toBeInTheDocument();
      expect(screen.getByText(/\(noun\)/)).toBeInTheDocument();
    });

    it('does not display word meaning when wordData is null', () => {
      render(<Banner {...defaultProps} gameOutcome="lose" wordData={null} />);

      expect(screen.queryByText(/means/)).not.toBeInTheDocument();
    });

    it('does not display word meaning when wordData is undefined', () => {
      render(<Banner {...defaultProps} gameOutcome="lose" wordData={undefined} />);

      expect(screen.queryByText(/means/)).not.toBeInTheDocument();
    });
  });

  describe('Reset Button', () => {
    it('renders reset button in win banner', () => {
      render(<Banner {...defaultProps} gameOutcome="win" />);

      const resetButton = screen.getByRole('button', { name: /reset game/i });
      expect(resetButton).toBeInTheDocument();
    });

    it('renders reset button in lose banner', () => {
      render(<Banner {...defaultProps} gameOutcome="lose" />);

      const resetButton = screen.getByRole('button', { name: /reset game/i });
      expect(resetButton).toBeInTheDocument();
    });

    it('calls resetGame when clicked in win banner', () => {
      const resetGame = jest.fn();
      render(<Banner {...defaultProps} gameOutcome="win" resetGame={resetGame} />);

      const resetButton = screen.getByRole('button', { name: /reset game/i });
      fireEvent.click(resetButton);

      expect(resetGame).toHaveBeenCalledTimes(1);
    });

    it('calls resetGame when clicked in lose banner', () => {
      const resetGame = jest.fn();
      render(<Banner {...defaultProps} gameOutcome="lose" resetGame={resetGame} />);

      const resetButton = screen.getByRole('button', { name: /reset game/i });
      fireEvent.click(resetButton);

      expect(resetGame).toHaveBeenCalledTimes(1);
    });

    it('has correct styling attributes', () => {
      render(<Banner {...defaultProps} />);

      const resetButton = screen.getByRole('button', { name: /reset game/i });
      expect(resetButton).toHaveStyle({
        marginLeft: '10px',
        padding: '4px 8px',
        cursor: 'pointer'
      });
    });
  });

  describe('Game Outcome States', () => {
    it('renders win banner when gameOutcome is "win"', () => {
      render(<Banner {...defaultProps} gameOutcome="win" />);

      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      expect(screen.queryByText(/sorry/i)).not.toBeInTheDocument();
    });

    it('renders lose banner when gameOutcome is "lose"', () => {
      render(<Banner {...defaultProps} gameOutcome="lose" />);

      expect(screen.getByText(/sorry/i)).toBeInTheDocument();
      expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();
    });

    it('renders lose banner when gameOutcome is neither "win" nor "lose"', () => {
      render(<Banner {...defaultProps} gameOutcome="draw" />);

      expect(screen.getByText(/sorry/i)).toBeInTheDocument();
      expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();
    });

    it('renders lose banner when gameOutcome is undefined', () => {
      render(<Banner {...defaultProps} gameOutcome={undefined} />);

      expect(screen.getByText(/sorry/i)).toBeInTheDocument();
      expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();
    });

    it('renders lose banner when gameOutcome is null', () => {
      render(<Banner {...defaultProps} gameOutcome={null} />);

      expect(screen.getByText(/sorry/i)).toBeInTheDocument();
      expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();
    });
  });

  describe('Word Data Integration', () => {
    it('displays complete word information in win banner', () => {
      const wordData = { meaning: 'fire, flame', part: 'noun' };
      render(<Banner {...defaultProps} gameOutcome="win" answer="IGNIS" wordData={wordData} />);

      expect(screen.getByText('IGNIS')).toBeInTheDocument();
      expect(screen.getByText(/means "fire, flame"/)).toBeInTheDocument();
      expect(screen.getByText(/\(noun\)/)).toBeInTheDocument();
    });

    it('displays complete word information in lose banner', () => {
      const wordData = { meaning: 'love, affection', part: 'noun' };
      render(<Banner {...defaultProps} gameOutcome="lose" answer="AMOR" wordData={wordData} />);

      expect(screen.getByText('AMOR')).toBeInTheDocument();
      expect(screen.getByText(/means "love, affection"/)).toBeInTheDocument();
      expect(screen.getByText(/\(noun\)/)).toBeInTheDocument();
    });

    it('handles wordData with different parts of speech', () => {
      const wordData = { meaning: 'to be', part: 'verb' };
      render(<Banner {...defaultProps} gameOutcome="win" wordData={wordData} />);

      expect(screen.getByText(/\(verb\)/)).toBeInTheDocument();
    });

    it('handles wordData with empty meaning', () => {
      const wordData = { meaning: '', part: 'noun' };
      render(<Banner {...defaultProps} gameOutcome="win" wordData={wordData} />);

      expect(screen.getByText(/means ""/)).toBeInTheDocument();
      expect(screen.getByText(/\(noun\)/)).toBeInTheDocument();
    });

    it('handles wordData with empty part', () => {
      const wordData = { meaning: 'test meaning', part: '' };
      render(<Banner {...defaultProps} gameOutcome="win" wordData={wordData} />);

      expect(screen.getByText(/means "test meaning"/)).toBeInTheDocument();
      expect(screen.getByText(/\(\)/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty guesses array in win banner', () => {
      render(<Banner {...defaultProps} gameOutcome="win" guesses={[]} />);

      expect(screen.getByText(/0 guesses/i)).toBeInTheDocument();
    });

    it('handles missing resetGame prop gracefully', () => {
      expect(() => {
        render(<Banner {...defaultProps} resetGame={undefined} />);
      }).not.toThrow();
    });

    it('handles missing answer prop', () => {
      render(<Banner {...defaultProps} answer={undefined} gameOutcome="lose" />);

      // Should still render but without answer text
      expect(screen.getByText(/sorry/i)).toBeInTheDocument();
    });

    it('handles null guesses array', () => {
      expect(() => {
        render(<Banner {...defaultProps} gameOutcome="win" guesses={null} />);
      }).toThrow(); // guesses.length will fail
    });

    it('handles undefined guesses array', () => {
      expect(() => {
        render(<Banner {...defaultProps} gameOutcome="win" guesses={undefined} />);
      }).toThrow(); // guesses.length will fail
    });
  });

  describe('Component Structure', () => {
    it('renders as a div with correct classes for win', () => {
      const { container } = render(<Banner {...defaultProps} gameOutcome="win" />);

      const banner = container.querySelector('.happy.banner');
      expect(banner).toBeInTheDocument();
      expect(banner.tagName).toBe('DIV');
    });

    it('renders as a div with correct classes for lose', () => {
      const { container } = render(<Banner {...defaultProps} gameOutcome="lose" />);

      const banner = container.querySelector('.sad.banner');
      expect(banner).toBeInTheDocument();
      expect(banner.tagName).toBe('DIV');
    });

    it('contains proper paragraph structure in win banner', () => {
      render(<Banner {...defaultProps} gameOutcome="win" />);

      const paragraphs = screen.getAllByText((content, element) => element?.tagName === 'P');
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it('contains proper paragraph structure in lose banner', () => {
      render(<Banner {...defaultProps} gameOutcome="lose" />);

      const paragraphs = screen.getAllByText((content, element) => element?.tagName === 'P');
      expect(paragraphs.length).toBeGreaterThan(0);
    });
  });

  describe('State Management', () => {
    it('updates when gameOver prop changes', () => {
      const { rerender } = render(<Banner {...defaultProps} gameOver={false} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();

      rerender(<Banner {...defaultProps} gameOver={true} />);

      expect(screen.getByRole('button', { name: /reset game/i })).toBeInTheDocument();
    });

    it('updates when gameOutcome prop changes', () => {
      const { rerender } = render(<Banner {...defaultProps} gameOutcome="win" />);

      expect(screen.getByText('Congratulations!')).toBeInTheDocument();

      rerender(<Banner {...defaultProps} gameOutcome="lose" />);

      expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();
      expect(screen.getByText(/sorry/i)).toBeInTheDocument();
    });

    it('updates when wordData prop changes', () => {
      const initialWordData = { meaning: 'initial', part: 'noun' };
      const { rerender } = render(<Banner {...defaultProps} wordData={initialWordData} />);

      expect(screen.getByText(/means "initial"/)).toBeInTheDocument();

      const updatedWordData = { meaning: 'updated', part: 'verb' };
      rerender(<Banner {...defaultProps} wordData={updatedWordData} />);

      expect(screen.queryByText(/means "initial"/)).not.toBeInTheDocument();
      expect(screen.getByText(/means "updated"/)).toBeInTheDocument();
      expect(screen.getByText(/\(verb\)/)).toBeInTheDocument();
    });
  });
});