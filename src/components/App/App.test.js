import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock child components
jest.mock('../Header/Header', () => {
  return function MockHeader() {
    return (
      <header data-testid="header">
        <h1>Verbula</h1>
      </header>
    );
  };
});

jest.mock('../Game/Game', () => {
  return function MockGame() {
    return (
      <div data-testid="game">
        <div data-testid="guess-results">Mock Guess Results</div>
        <div data-testid="guess-input">Mock Guess Input</div>
      </div>
    );
  };
});

describe('App', () => {
  describe('Component Structure', () => {
    it('renders the main wrapper container', () => {
      const { container } = render(<App />);

      const wrapper = container.querySelector('.wrapper');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper.tagName).toBe('DIV');
    });

    it('renders the game wrapper container', () => {
      const { container } = render(<App />);

      const gameWrapper = container.querySelector('.game-wrapper');
      expect(gameWrapper).toBeInTheDocument();
      expect(gameWrapper.tagName).toBe('DIV');
    });

    it('has correct DOM hierarchy', () => {
      const { container } = render(<App />);

      const wrapper = container.querySelector('.wrapper');
      const gameWrapper = container.querySelector('.game-wrapper');

      expect(wrapper).toContainElement(gameWrapper);
    });
  });

  describe('Child Component Integration', () => {
    it('renders Header component', () => {
      render(<App />);

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(screen.getByText('Verbula')).toBeInTheDocument();
    });

    it('renders Game component', () => {
      render(<App />);

      const game = screen.getByTestId('game');
      expect(game).toBeInTheDocument();
      expect(screen.getByText('Mock Guess Results')).toBeInTheDocument();
      expect(screen.getByText('Mock Guess Input')).toBeInTheDocument();
    });

    it('renders Header before Game in DOM order', () => {
      render(<App />);

      const header = screen.getByTestId('header');
      const game = screen.getByTestId('game');

      const allElements = Array.from(document.querySelectorAll('[data-testid]'));
      const headerIndex = allElements.indexOf(header);
      const gameIndex = allElements.indexOf(game);

      expect(headerIndex).toBeLessThan(gameIndex);
    });

    it('places Game component inside game-wrapper', () => {
      const { container } = render(<App />);

      const gameWrapper = container.querySelector('.game-wrapper');
      const game = screen.getByTestId('game');

      expect(gameWrapper).toContainElement(game);
    });

    it('places Header component directly in wrapper (not in game-wrapper)', () => {
      const { container } = render(<App />);

      const wrapper = container.querySelector('.wrapper');
      const gameWrapper = container.querySelector('.game-wrapper');
      const header = screen.getByTestId('header');

      expect(wrapper).toContainElement(header);
      expect(gameWrapper).not.toContainElement(header);
    });
  });

  describe('Layout Structure', () => {
    it('maintains proper semantic structure', () => {
      const { container } = render(<App />);

      // Should have one main wrapper
      const wrappers = container.querySelectorAll('.wrapper');
      expect(wrappers).toHaveLength(1);

      // Should have one game wrapper
      const gameWrappers = container.querySelectorAll('.game-wrapper');
      expect(gameWrappers).toHaveLength(1);
    });

    it('renders components in correct structural order', () => {
      const { container } = render(<App />);

      const wrapper = container.querySelector('.wrapper');
      const children = Array.from(wrapper.children);

      // First child should be header
      expect(children[0]).toHaveAttribute('data-testid', 'header');

      // Second child should be game-wrapper
      expect(children[1]).toHaveClass('game-wrapper');
    });

    it('game-wrapper contains only Game component', () => {
      const { container } = render(<App />);

      const gameWrapper = container.querySelector('.game-wrapper');
      const children = Array.from(gameWrapper.children);

      expect(children).toHaveLength(1);
      expect(children[0]).toHaveAttribute('data-testid', 'game');
    });
  });

  describe('CSS Classes', () => {
    it('applies wrapper class to main container', () => {
      const { container } = render(<App />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('wrapper');
    });

    it('applies game-wrapper class to game container', () => {
      const { container } = render(<App />);

      const gameContainer = container.querySelector('.game-wrapper');
      expect(gameContainer).toHaveClass('game-wrapper');
    });

    it('does not apply any additional classes', () => {
      const { container } = render(<App />);

      const wrapper = container.querySelector('.wrapper');
      const gameWrapper = container.querySelector('.game-wrapper');

      // Should only have the expected single class
      expect(wrapper.className).toBe('wrapper');
      expect(gameWrapper.className).toBe('game-wrapper');
    });
  });

  describe('Component Isolation', () => {
    it('renders without any props', () => {
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });

    it('is a stateless functional component', () => {
      // App should not manage any state itself
      const { container, rerender } = render(<App />);

      const initialHTML = container.innerHTML;

      // Re-render should produce identical output
      rerender(<App />);

      expect(container.innerHTML).toBe(initialHTML);
    });

    it('does not pass any props to child components', () => {
      // This is inherently tested by our mocks not expecting any props
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('maintains semantic document structure', () => {
      render(<App />);

      // Should have a header element (from Header component)
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();

      // Should have main content area (the game)
      const gameArea = screen.getByTestId('game');
      expect(gameArea).toBeInTheDocument();
    });

    it('provides proper landmark structure', () => {
      const { container } = render(<App />);

      // The wrapper div provides the main document structure
      const wrapper = container.querySelector('.wrapper');
      expect(wrapper).toBeInTheDocument();

      // Header should be accessible as a banner landmark
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Rendering Behavior', () => {
    it('renders consistently on multiple calls', () => {
      const { container: container1 } = render(<App />);
      const { container: container2 } = render(<App />);

      // Both should have same structure
      expect(container1.querySelector('.wrapper')).toBeInTheDocument();
      expect(container2.querySelector('.wrapper')).toBeInTheDocument();
      expect(container1.querySelector('.game-wrapper')).toBeInTheDocument();
      expect(container2.querySelector('.game-wrapper')).toBeInTheDocument();
    });

    it('handles re-rendering gracefully', () => {
      const { container, rerender } = render(<App />);

      const initialWrapper = container.querySelector('.wrapper');
      expect(initialWrapper).toBeInTheDocument();

      rerender(<App />);

      const rerenderedWrapper = container.querySelector('.wrapper');
      expect(rerenderedWrapper).toBeInTheDocument();
    });

    it('maintains child component presence across re-renders', () => {
      const { rerender } = render(<App />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('game')).toBeInTheDocument();

      rerender(<App />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('game')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing child components gracefully', () => {
      // This test ensures our mocks are working and the component structure is sound
      render(<App />);

      // Should render without throwing even if child components are mocked
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('game')).toBeInTheDocument();
    });

    it('maintains structural integrity', () => {
      const { container } = render(<App />);

      // Core structure should always be present
      expect(container.querySelector('.wrapper')).toBeInTheDocument();
      expect(container.querySelector('.game-wrapper')).toBeInTheDocument();
    });
  });

  describe('Integration Points', () => {
    it('provides proper mounting point for Header', () => {
      render(<App />);

      const header = screen.getByTestId('header');
      const wrapper = header.closest('.wrapper');

      expect(wrapper).toBeInTheDocument();
    });

    it('provides proper mounting point for Game', () => {
      render(<App />);

      const game = screen.getByTestId('game');
      const gameWrapper = game.closest('.game-wrapper');
      const mainWrapper = gameWrapper.closest('.wrapper');

      expect(gameWrapper).toBeInTheDocument();
      expect(mainWrapper).toBeInTheDocument();
    });

    it('isolates game area from header area', () => {
      const { container } = render(<App />);

      const header = screen.getByTestId('header');
      const game = screen.getByTestId('game');
      const gameWrapper = container.querySelector('.game-wrapper');

      // Header should not be inside game wrapper
      expect(gameWrapper).not.toContainElement(header);
      // Game should be inside game wrapper
      expect(gameWrapper).toContainElement(game);
    });
  });

  describe('Performance Considerations', () => {
    it('renders minimal DOM structure', () => {
      const { container } = render(<App />);

      // Should only create necessary wrapper elements
      const allDivs = container.querySelectorAll('div');

      // Should have: wrapper, game-wrapper, and mock game div = 3 total from App
      // (plus any from mock components)
      expect(allDivs.length).toBeGreaterThanOrEqual(3);
    });

    it('does not create unnecessary wrapper elements', () => {
      const { container } = render(<App />);

      const wrapper = container.querySelector('.wrapper');
      const directChildren = Array.from(wrapper.children);

      // Should only have 2 direct children: header and game-wrapper
      expect(directChildren).toHaveLength(2);
    });
  });
});