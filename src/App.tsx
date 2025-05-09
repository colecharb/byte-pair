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
  const inputByteSize = getByteSize(input);

  const [tokens, setTokens] = useState<string[]>([]);
  const tokensByteSize = getByteSize(tokens.join(''));
  const [tokenization, setTokenization] = useState<string[]>([]);
  const tokenizationByteSize = tokensByteSize + tokenization.length;

  const [hoveredToken, setHoveredToken] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const [tokenizeRunning, setTokenizeRunning] = useState(false);
  const [tokenizationFinished, setTokenizationFinished] = useState(false);

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [count, setCount] = useState(0);
  const [addingToken, setAddingToken] = useState(false);

  /**
   * When true, some tokens may be unused
   * and could be removed with removeVestigialTokens()
   */
  const [tokensStale, setTokensStale] = useState(false);

  const removeVestigialTokens = () => {
    setTokens((prevTokens) =>
      prevTokens.filter((token) => tokenization.includes(token)),
    );
    setTokensStale(false);
  };

  useEffect(() => {
    if (!wikiText) {
      return;
    }
    changeText(wikiText);
    setTokenizationFinished(false);
  }, [wikiText]);

  const changeText = (text: string) => {
    setInput(text);
    setSelectedToken(null);
    setCount(0);

    const newTokens = Array.from(new Set(text));

    setInput(text);
    setTokens(newTokens);
    setTokensStale(false);
    setTokenization(text.split(''));
    setTokenizationFinished(false);
  };

  const addToken = () => {
    setAddingToken(true);

    if (tokenization.length < 2 || tokenizationFinished) {
      setAddingToken(false);
      return;
    }

    // Create a map to store pair counts
    const pairCounts = new Map<string, number>();

    // Iterate through inputAsTokens to count adjacent pairs
    for (let i = 0; i < tokenization.length - 1; i++) {
      const tokenOne = tokenization[i];
      const tokenTwo = tokenization[i + 1];

      // Only merge MERGEABLE chars
      if (!MERGEABLE.test(tokenOne)) {
        continue;
      }
      if (!MERGEABLE.test(tokenTwo)) {
        // IF second token is not mergeable, skip next iteration.
        i++;
        continue;
      }

      const pair: [string, string] = [tokenOne, tokenTwo];
      const pairString = JSON.stringify(pair);
      const currentCount = pairCounts.get(pairString) || 0;
      pairCounts.set(pairString, currentCount + 1);
    }

    // Find the pair with the highest count
    const [mostCommonPairString, highestCount] = Array.from(
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
    // Create a new token from the most common pair
    const mostCommonPair = JSON.parse(mostCommonPairString) as [string, string];
    const newToken = mostCommonPair.join('');
    setTokens((prev) => [...prev, newToken]);
    setTokensStale(true);

    // Update inputAsTokens to include the new token
    setTokenization((oldTokenization) => {
      const newTokenization: string[] = [];
      for (let i = 0; i < oldTokenization.length; i++) {
        const tokenOne = oldTokenization[i];
        const tokenTwo = oldTokenization[i + 1];
        if (tokenOne === mostCommonPair[0] && tokenTwo === mostCommonPair[1]) {
          // If the pair is found, use the new token
          newTokenization.push(newToken);
          // increase i to skip next index (we replaced 2 tokens with 1 token)
          i++;
          continue;
        }
        newTokenization.push(tokenOne);
      }
      return newTokenization;
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
    <div className='flex flex-col mt-25 px-0 sm:px-4 md:px-8 lg:px-16 xl:px-24 text-center relative z-10 gap-10'>
      <CardTitle>Byte Pair Encoding</CardTitle>
      <Card className='flex flex-col bg-card backdrop-blur-sm border-0 sm:border-1 border-muted max-w-[1500px] mx-auto'>
        <Button
          className='absolute top-2 right-2'
          variant='ghost'
          size='icon'
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
        </Button>
        <CardContent className='flex flex-col pt-6'>
          <div className='flex flex-col lg:flex-row gap-6'>
            <div className='flex flex-col flex-1 gap-3 justify-start align-start flex-wrap'>
              <h3 className='text-left text-lg font-medium'>Text</h3>
              <Button
                onClick={refetchWikiText}
                disabled={isLoading}
                variant='secondary'
              >
                {isLoading ? 'Loading...' : 'Randomize Text'}
              </Button>
              <Input
                // autoResize
                className='h-85'
                placeholder='Add some text as a basis for your vocabulary.'
                value={input}
                onChange={(e) => changeText(e.target.value)}
              />
              <div className='mt-auto'>{`${inputByteSize} bytes`}</div>
            </div>

            <div className='flex flex-col flex-1 gap-3 justify-start align-start flex-wrap'>
              <h3 className='text-left text-lg font-medium'>
                Token Vocabulary
              </h3>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={removeVestigialTokens}
                  disabled={!tokensStale}
                >
                  Remove Unused
                </Button>
                <Button
                  variant='secondary'
                  disabled={tokenizationFinished || tokenizeRunning}
                  onClick={addToken}
                >
                  Add One
                </Button>
                <Button
                  variant={tokenizeRunning ? 'default' : 'secondary'}
                  disabled={tokenizationFinished}
                  onClick={onPressStartStop}
                >
                  {tokenizeRunning ? 'Stop' : 'Start'}
                </Button>
              </div>

              <div className='flex flex-wrap justify-center gap-1'>
                {tokens.map((token, index) => (
                  <div
                    key={token}
                    onMouseEnter={() => setHoveredToken(token)}
                    onMouseLeave={() => setHoveredToken(null)}
                    onClick={() =>
                      setSelectedToken((prev) =>
                        token === prev ? null : token,
                      )
                    }
                  >
                    <Token
                      token={token}
                      hovered={token === hoveredToken}
                      selected={token === selectedToken}
                    />
                  </div>
                ))}
              </div>
              <div className='mt-auto'>{`~ ${tokensByteSize} bytes`}</div>
            </div>

            <div className='flex flex-col flex-2 gap-3 justify-start align-start flex-wrap'>
              <h3 className='text-left text-lg font-medium'>Tokenized Text</h3>
              <div className='flex flex-wrap gap-1'>
                {tokenization.map((token, index) => {
                  return (
                    <div
                      key={`${index}-${token}`}
                      onMouseEnter={() => setHoveredToken(token)}
                      onMouseLeave={() => setHoveredToken(null)}
                      onClick={() =>
                        setSelectedToken((prevSelected) =>
                          token === prevSelected ? null : token,
                        )
                      }
                    >
                      <Token
                        token={token}
                        hovered={token === hoveredToken}
                        selected={token === selectedToken}
                        className='rounded-sm px-1 py-0'
                      />
                    </div>
                  );
                })}
              </div>
              <div className='mt-auto'>{`~ ${tokenizationByteSize} bytes (${(
                (tokenizationByteSize * 100) /
                inputByteSize
              ).toFixed(0)}% original size)`}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
