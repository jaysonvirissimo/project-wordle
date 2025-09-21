# Verbula

This project started out as solution to the Word Game project from Josh W Comeau's [Joy of React](https://courses.joshwcomeau.com/joy-of-react) course, but then became a game for my kids to practice Latin.

## Getting Started

### Prerequisites

- **Node.js 24** or higher
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd verbula
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the App

**Development mode:**
```bash
npm run dev
```
This will start the development server at `http://localhost:1234`. The app will automatically reload when you make changes.

**Build for production:**
```bash
npm run build
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run new-component` - Generate new React component

### How to Play

1. Enter a 5-letter Latin word in the input field
2. Press Enter to submit your guess
3. Letters will be colored based on their correctness:
   - **Green**: Correct letter in the correct position
   - **Yellow**: Correct letter in the wrong position
   - **Gray**: Letter not in the word
4. You have 6 attempts to guess the correct word
5. Click "Show Hint" to see the meaning and part of speech
6. Diacritics are ignored (mōtum = motum)
7. Click "Reset Game" to start over with a new word

### Features

- **801 Latin words** from medieval Latin dictionary
- **Hint system** showing meanings and parts of speech
- **Diacritic normalization** (ō = o, ā = a, etc.)
- **All word types** (nouns, verbs, adjectives, etc.)
- **Educational focus** perfect for Latin learners
