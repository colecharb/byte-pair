import './index.css';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { useEffect, useState } from 'react';
import { Input } from './components/ui/input';
import { Token } from './components/ui/token';
import { Button } from './components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useIsDark } from './hooks/useIsDark';
import useText from './hooks/useText';
import getByteSize from './helpers/getByteSize';

/**
 * Only these tokens are allowed to be merged
 */
const MERGEABLE = /^[a-zA-Z0-9']*$/;

export function App() {
  const [isDark, setIsDark] = useIsDark();

  const { text: wikiText, isLoading, refetch: refetchWikiText } = useText();

  const [input, setInput] = useState<string>('');

  const [tokens, setTokens] = useState<string[]>([]);
  const [inputAsTokenIndices, setInputAsTokenIndices] = useState<number[]>([]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [tokenizeRunning, setTokenizeRunning] = useState(false);
  const [tokenizationFinished, setTokenizationFinished] = useState(false);

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [count, setCount] = useState(0);
  const [addingToken, setAddingToken] = useState(false);

  useEffect(() => {
    if (!wikiText) {
      return;
    }
    changeText(wikiText);
    setTokenizationFinished(false);
  }, [wikiText]);

  const changeText = (text: string) => {
    setInput(text);
    setSelectedIndex(null);
    setCount(0);

    const newTokens = Array.from(new Set(text));

    setInput(text);
    setTokens(newTokens);
    setInputAsTokenIndices(
      text.split('').map((char) => newTokens.indexOf(char)),
    );
  };

  const addToken = () => {
    setAddingToken(true);

    if (inputAsTokenIndices.length < 2 || tokenizationFinished) {
      setAddingToken(false);
      return;
    }

    // Create a map to store pair counts
    const pairCounts = new Map<string, number>();

    // Iterate through inputAsTokens to count adjacent pairs
    for (let i = 0; i < inputAsTokenIndices.length - 1; i++) {
      const tokenIndexOne = inputAsTokenIndices[i];
      const tokenIndexTwo = inputAsTokenIndices[i + 1];

      const tokenOne = tokens[tokenIndexOne];
      const tokenTwo = tokens[tokenIndexTwo];

      // Only merge MERGEABLE chars
      if (!MERGEABLE.test(tokenOne)) {
        continue;
      }
      if (!MERGEABLE.test(tokenTwo)) {
        // IF second token is not mergeable, skip next iteration.
        i++;
        continue;
      }

      const pair: string = `${tokenIndexOne},${tokenIndexTwo}`;
      const currentCount = pairCounts.get(pair) || 0;
      pairCounts.set(pair, currentCount + 1);
    }

    // Find the pair with the highest count
    const [mostCommonPair, highestCount] = Array.from(
      pairCounts.entries(),
    ).reduce((a, b) => (a[1] > b[1] ? a : b));

    if (highestCount <= 1) {
      console.log(
        'No valid token pair occurs more than once; no token created; tokenization finished.',
      );
      setTokenizationFinished(true);
      stopTokenizing();
      setAddingToken(false);
      return;
    }
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

    setAddingToken(false);
  };

  const startTokenizing = () => {
    const interval = setInterval(() => {
      // Use the latest count value via the ref
      setCount((prev) => prev + 1);
    }, 10);
    setIntervalId(interval);
    setTokenizeRunning(true);
  };

  const stopTokenizing = () => {
    clearInterval(intervalId);
    setTokenizeRunning(false);
  };

  const onPressStartStop = () => {
    if (!tokenizeRunning) {
      startTokenizing();
    } else {
      stopTokenizing();
    }
  };

  useEffect(() => {
    // console.log('add token count:', count);
    if (count < 1 || addingToken) {
      return;
    }
    addToken();
  }, [count]);

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
              <h3 className='text-left text-lg font-medium'>Text</h3>
              <Button
                onClick={refetchWikiText}
                disabled={isLoading}
                variant='secondary'
              >
                {isLoading ? 'Loading...' : 'Random Text'}
              </Button>
              <Input
                // autoResize
                className='flex-1'
                placeholder='Add some text as a basis for your vocabulary.'
                value={input}
                onChange={(e) => changeText(e.target.value)}
              />
              {`${getByteSize(input)} bytes`}
            </div>

            <div className='flex flex-col flex-1 gap-3 justify-start align-start flex-wrap'>
              <h3 className='text-left text-lg font-medium'>
                Token Vocabulary
              </h3>
              <div className='flex gap-2'>
                <Button
                  variant='secondary'
                  disabled={tokenizationFinished || tokenizeRunning}
                  onClick={addToken}
                >
                  Add Token
                </Button>
                <Button
                  variant={tokenizeRunning ? 'default' : 'secondary'}
                  disabled={tokenizationFinished}
                  onClick={onPressStartStop}
                >
                  {tokenizeRunning ? 'Stop' : 'Start'}
                </Button>
              </div>

              <div className='flex flex-wrap gap-1'>
                {tokens.map((token, index) => (
                  <div
                    key={token}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() =>
                      setSelectedIndex((prev) =>
                        index === prev ? null : index,
                      )
                    }
                  >
                    <Token
                      token={token}
                      hovered={index === hoveredIndex}
                      selected={index === selectedIndex}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className='flex flex-col flex-2 gap-3 justify-start align-start flex-wrap'>
              <h3 className='text-left text-lg font-medium'>Tokenized Text</h3>
              <div className='flex flex-wrap gap-1'>
                {inputAsTokenIndices.map((tokenIndex, index) => {
                  const token = tokens[tokenIndex];
                  return (
                    <div
                      key={`${index}-${tokens[tokenIndex]}`}
                      onMouseEnter={() => setHoveredIndex(tokenIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() =>
                        setSelectedIndex((prev) =>
                          index === prev ? null : tokenIndex,
                        )
                      }
                    >
                      <Token
                        token={token}
                        hovered={tokenIndex === hoveredIndex}
                        selected={tokenIndex === selectedIndex}
                        className='rounded-sm px-1 py-0'
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
