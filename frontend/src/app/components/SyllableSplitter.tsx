import { useAccessibility } from '../contexts/AccessibilityContext';

// Simple syllable splitting algorithm
function splitIntoSyllables(word: string): string[] {
  // Basic syllable rules - this is simplified
  const vowels = 'aeiouy';
  const syllables: string[] = [];
  let currentSyllable = '';
  
  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase();
    currentSyllable += word[i];
    
    // Split when we find a vowel followed by consonants
    if (vowels.includes(char) && i < word.length - 1) {
      const nextChar = word[i + 1].toLowerCase();
      if (!vowels.includes(nextChar) && currentSyllable.length >= 2) {
        syllables.push(currentSyllable);
        currentSyllable = '';
      }
    }
  }
  
  if (currentSyllable) {
    syllables.push(currentSyllable);
  }
  
  return syllables.length > 0 ? syllables : [word];
}

interface SyllableSplitterProps {
  text: string;
}

export function SyllableSplitter({ text }: SyllableSplitterProps) {
  const { settings } = useAccessibility();

  if (!settings.syllableSplitterEnabled) {
    return <>{text}</>;
  }

  const words = text.split(' ');
  
  return (
    <>
      {words.map((word, wordIndex) => {
        // Only split complex words (more than 7 characters)
        if (word.length <= 7) {
          return <span key={wordIndex}>{word} </span>;
        }

        const syllables = splitIntoSyllables(word);
        
        return (
          <span key={wordIndex} className="inline-block">
            {syllables.map((syllable, syllableIndex) => (
              <span
                key={syllableIndex}
                className="inline-block"
                style={{
                  color: syllableIndex % 2 === 0 ? 'inherit' : 'rgba(59, 130, 246, 0.8)',
                }}
              >
                {syllable}
                {syllableIndex < syllables.length - 1 && (
                  <span className="text-blue-400" style={{ fontSize: '0.8em' }}>·</span>
                )}
              </span>
            ))}
            <span> </span>
          </span>
        );
      })}
    </>
  );
}
