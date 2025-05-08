import './index.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Input } from './components/ui/input';
import { Token } from './components/ui/token';
import { Button } from './components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useIsDark } from './hooks/useIsDark';
import defaultInput from './constants/defaultInput';

export function App() {
  const [isDark, setIsDark] = useIsDark();

  const [input, setInput] = useState(defaultInput);
  const [tokens, setTokens] = useState<string[]>(
    Array.from(new Set(defaultInput)),
  );
  const [inputAsTokenIndices, setInputAsTokenIndices] = useState<number[]>(
    defaultInput.split('').map((char) => tokens.indexOf(char)),
  );

  console.log(tokens, tokens.length, inputAsTokenIndices);

  const onChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const newTokens = Array.from(new Set(text));
    setInput(text);
    setTokens(newTokens);
    setInputAsTokenIndices(
      text.split('').map((char) => newTokens.indexOf(char)),
    );
  };

  const onClickAddToken = () => {
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
      let newInputAsTokenIndices: number[] = [];
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
    <div className='container w-full p-8 text-center relative z-10'>
      <Card className='bg-card backdrop-blur-sm border-muted'>
        <Button
          className='absolute top-0 right-0 m-2'
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
          <div className='flex gap-4'>
            <div className='flex flex-col flex-1 gap-2 justify-start align-start flex-wrap'>
              <Input
                className='h-75'
                placeholder='Add some text as a basis for your vocabulary.'
                defaultValue={defaultInput}
                onChange={onChangeInput}
              />
              <Button onClick={onClickAddToken}>Add Token</Button>
            </div>

            <div className='flex flex-col flex-1 gap-2 justify-start align-start flex-wrap'>
              <h3 className='text-left text-sm font-medium'>
                Token Vocabulary
              </h3>
              <div className='flex flex-wrap gap-2'>
                {tokens.map((token) => (
                  <Token
                    key={token}
                    token={token}
                  />
                ))}
              </div>
            </div>

            <div className='flex flex-col flex-2 gap-2 justify-start align-start flex-wrap'>
              <h3 className='text-left text-sm font-medium'>Input as tokens</h3>
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
