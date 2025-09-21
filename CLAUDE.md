# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start development server:**
```bash
npm run dev
```
- Runs on `http://localhost:1234` with hot reload
- Automatically fetches and builds Latin dictionary before starting

**Run tests:**
```bash
npm test                    # Run all tests
npm test ComponentName      # Run specific component tests
```

**Linting and quality:**
```bash
npm run lint               # Run ESLint with auto-fix
```

**Building:**
```bash
npm run build              # Local production build
npm run build:production   # GitHub Pages build with /verbula/ public URL
npm run build:dictionary   # Fetch and process Latin dictionary only
```

**Generate new component:**
```bash
npm run new-component
```

## Architecture Overview

This is a Latin word guessing game (Wordle-style) built with React 19 and comprehensive test coverage.

### Core Game Architecture

**Data Flow:**
1. **Dictionary Loading**: `scripts/build-dictionary.js` fetches medieval Latin words from external GitHub repo, filters for 5-letter words, normalizes diacritics, and generates `src/words.json`
2. **Game State**: `Game` component manages all game state (current word, guesses, game over status, hint visibility)
3. **Word Selection**: `sampleWord()` utility selects random word with associated meaning/part-of-speech data
4. **Guess Processing**: `checkGuess()` algorithm compares guesses to answers with Wordle-style letter status (correct/misplaced/incorrect)
5. **Diacritic Handling**: User input normalized via `normalizeDiacritics()` so "mōtum" matches "MOTUM"

**Component Hierarchy:**
```
App
├── Header (title display)
└── Game (game state management)
    ├── Banner (win/lose messages with reset)
    ├── GuessResults (6-row grid display)
    │   └── Guess components (5-cell letter display)
    └── GuessInput (user input with hint button)
```

### Key Technical Patterns

**State Management:**
- Game component uses multiple `useState` hooks for different state aspects
- Props flow down, callbacks flow up for state updates
- No external state management library - pure React state

**Word Data Structure:**
```javascript
// src/words.json format
{
  "TERRA": {
    "original": "terra",
    "meaning": "earth, land",
    "part": "noun",
    "pronunciation": "..."
  }
}
```

**Testing Strategy:**
- Comprehensive test coverage (170+ tests) across all components
- Child components mocked in integration tests to isolate behavior
- Edge cases and error conditions extensively tested
- Test files co-located with components (Component.test.js)

**Styling Approach:**
- CSS classes with semantic naming (.wrapper, .game-wrapper, .guess-results)
- Inline styles for component-specific styling
- No CSS framework - custom styles in CSS files

### Build System

**Parcel Bundler:**
- Handles all transpilation, bundling, and dev server
- No webpack configuration needed
- Separate Babel config only for Jest tests

**Dictionary Build Process:**
- Runs before every dev/build command
- Fetches fresh data from external medieval Latin dictionary
- Processes 801 five-letter words with meanings
- Normalizes diacritics for gameplay compatibility

**Deployment:**
- GitHub Actions CI/CD pipeline
- Automatic deployment to GitHub Pages on main branch push
- Hosted at virissimo.info/verbula with proper subpath configuration

### Development Conventions

**Component Structure:**
Each component folder contains:
- `ComponentName.js` - Main component
- `ComponentName.test.js` - Comprehensive tests
- `index.js` - Export barrel

**Import Patterns:**
- Relative imports for local components
- Named exports for utilities
- JSON import for word data
- React 19 functional components with hooks

**Game Logic:**
- 6 guess limit enforced by `NUM_OF_GUESSES_ALLOWED` constant
- Letter status: 'correct', 'misplaced', 'incorrect'
- Win condition: all letters correct
- Lose condition: 6 guesses without winning
- Hint system shows meaning and part of speech on demand

**Testing Requirements:**
Always run the full test suite (`npm test`) before making changes to ensure no regressions in the 170+ existing tests covering all component behaviors, edge cases, and integration points.