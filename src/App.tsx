import './index.css';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { useEffect, useState } from 'react';
import { Input } from './components/ui/input';
import { Token } from './components/ui/token';
import { Button } from './components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useIsDark } from './hooks/useIsDark';
import { useWikipediaText } from './hooks/useWikipediaText';

export function App() {
  const [isDark, setIsDark] = useIsDark();

  const { wikiText, refetch } = useWikipediaText();

  const [tokens, setTokens] = useState<string[]>([]);
  const [inputAsTokenIndices, setInputAsTokenIndices] = useState<number[]>([]);

  useEffect(() => {
    const newTokens = Array.from(new Set(wikiText));
    setTokens(newTokens);
    setInputAsTokenIndices(
      wikiText.split('').map((char) => newTokens.indexOf(char)),
    );
  }, [wikiText]);

  const onChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const newTokens = Array.from(new Set(text));
    // setInput(text);
    setTokens(newTokens);
    setInputAsTokenIndices(
      text.split('').map((char) => newTokens.indexOf(char)),
    );
  };

  const onClickAddToken = () => {
    if (inputAsTokenIndices.length === 0) {
      return;
    }

    // Create a map to store pair counts
    const pairCounts = new Map<string, number>();

    // Iterate through inputAsTokens to count adjacent pairs
    for (let i = 0; i < inputAsTokenIndices.length - 1; i++) {
      const pair: string = `${inputAsTokenIndices[i]},${
        inputAsTokenIndices[i + 1]
      }`;
      const currentCount = pairCounts.get(pair) || 0;
      pairCounts.set(pair, currentCount + 1);
    }

    // Find the pair with the highest count
    const mostCommonPairCount = Array.from(pairCounts.entries()).reduce(
      (a, b) => (a[1] > b[1] ? a : b),
    );

    // Get the pair with the highest count
    const mostCommonPair = mostCommonPairCount[0];
    const mostCommonPairTokens = mostCommonPair.split(',').map(Number);

    // Create a new token from the most common pair
    const newToken =
      tokens[mostCommonPairTokens[0]] + tokens[mostCommonPairTokens[1]];
    setTokens((prev) => [...prev, newToken]);
    const newTokenIndex = tokens.length;

    // Update inputAsTokens to include the new token
    setInputAsTokenIndices((oldInputAsTokenIndices) => {
      const newInputAsTokenIndices: number[] = [];
      for (let i = 0; i < oldInputAsTokenIndices.length; i++) {
        const tokenIndexA = oldInputAsTokenIndices[i];
        const tokenIndexB = oldInputAsTokenIndices[i + 1];
        if (
          tokenIndexA === mostCommonPairTokens[0] &&
          tokenIndexB === mostCommonPairTokens[1]
        ) {
          // If the pair is found, use the new token
          // TODO: swap indexOf for tokens.length ?
          newInputAsTokenIndices.push(newTokenIndex);
          i++; // increase i to skip next index
          continue;
        }
        newInputAsTokenIndices.push(tokenIndexA);
      }
      return newInputAsTokenIndices;
    });
  };

  return (
    <div className='w-full mt-10 px-4 md:px-8 lg:px-16 xl:px-24 text-center relative z-10'>
      <Card className='flex flex-col bg-card backdrop-blur-sm border-muted w-full max-w-[1500px] mx-auto'>
        <Button
          className='absolute top-2 right-2'
          variant='ghost'
          size='icon'
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
        </Button>
        <CardHeader className='flex flex-row justify-center items-center'>
          <CardTitle>Byte Pair Encoding</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col pt-6 gap-4'>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex flex-col flex-1 gap-3 justify-start align-start flex-wrap'>
              <h3 className='text-left text-lg font-medium'>Input</h3>
              <Input
                // autoResize
                className='h-85'
                placeholder='Add some text as a basis for your vocabulary.'
                defaultValue={wikiText}
                onChange={onChangeInput}
              />
            </div>

            <div className='flex flex-col flex-1 gap-3 justify-start align-start flex-wrap'>
              <h3 className='text-left text-lg font-medium'>
                Token Vocabulary
              </h3>
              <Button
                disabled={
                  inputAsTokenIndices.length === 0 ||
                  inputAsTokenIndices.length === 1
                }
                onClick={onClickAddToken}
              >
                Add Token
              </Button>
              <div className='flex flex-wrap gap-2'>
                {tokens.map((token) => (
                  <Token
                    key={token}
                    token={token}
                  />
                ))}
              </div>
            </div>

            <div className='flex flex-col flex-2 gap-3 justify-start align-start flex-wrap'>
              <h3 className='text-left text-lg font-medium'>Tokenized Input</h3>
              <div className='flex flex-wrap'>
                {inputAsTokenIndices.map((tokenIndex, index) => (
                  <Token
                    key={`${index}-${tokens[tokenIndex]}`}
                    token={tokens[tokenIndex]}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
