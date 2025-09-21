#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DICTIONARY_URL = 'https://raw.githubusercontent.com/jaysonvirissimo/medieval_latina/master/data/dictionary.json';

// Function to normalize diacritics
function normalizeDiacritics(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toUpperCase();
}

async function buildDictionary() {
  try {
    console.log('Fetching dictionary from:', DICTIONARY_URL);

    const response = await fetch(DICTIONARY_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch dictionary: ${response.status}`);
    }

    const dictionary = await response.json();
    console.log(`Fetched ${Object.keys(dictionary).length} total words`);

    // Process words: filter 5-letter words and prepare game data
    const gameWords = {};
    let processedCount = 0;

    for (const [originalWord, data] of Object.entries(dictionary)) {
      const normalizedWord = normalizeDiacritics(originalWord);

      // Only include 5-letter words
      if (normalizedWord.length === 5) {
        gameWords[normalizedWord] = {
          original: originalWord,
          meaning: data.meaning || 'No translation available',
          part: data.part || 'Unknown',
          pronunciation: data.pronunciation || data.ipa || '',
        };
        processedCount++;
      }
    }

    console.log(`Processed ${processedCount} five-letter words`);

    if (processedCount === 0) {
      throw new Error('No 5-letter words found in dictionary');
    }

    // Write to src directory
    const outputPath = path.join(__dirname, '..', 'src', 'words.json');
    fs.writeFileSync(outputPath, JSON.stringify(gameWords, null, 2));

    console.log(`Dictionary built successfully: ${outputPath}`);
    console.log(`Available words: ${Object.keys(gameWords).slice(0, 10).join(', ')}...`);

  } catch (error) {
    console.error('Error building dictionary:', error.message);
    process.exit(1);
  }
}

buildDictionary();