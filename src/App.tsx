import './index.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Input } from './components/ui/input';
import { Token } from './components/ui/token';
import { Button } from './components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useIsDark } from './hooks/useIsDark';

const defaultInput =
  "Hi! I like making things. \
I'm a developer and designer with a background in pure math and an obsession with constantly learning and improving my skills. \
Developing intuitive and appealing user experiences is what I'm all about. \
Check out the projects tab for examples of my work and feel free to contact me if you're interested in working together. \
I'm always excited to take on new challenges.";

export function App() {
  const [isDark, setIsDark] = useIsDark();

  const [input, setInput] = useState(defaultInput);
  const [tokens, setTokens] = useState<string[]>(
    Array.from(new Set(defaultInput)),
  );
  const [inputAsTokens, setInputAsTokens] = useState<number[]>(
    defaultInput.split('').map((char) => tokens.indexOf(char)),
  );

  const onChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInput(text);
    setTokens(Array.from(new Set(text)));
    setInputAsTokens(text.split('').map((char) => tokens.indexOf(char)));
  };

  return (
    <div className='container w-200 p-8 text-center relative z-10'>
      <Card className='bg-card backdrop-blur-sm border-muted'>
        <CardHeader className='flex flex-row justify-center items-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? (
              <Sun className='h-5 w-5' />
            ) : (
              <Moon className='h-5 w-5' />
            )}
          </Button>
          <CardTitle>Byte Pair Encoding</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col pt-6 gap-4'>
          <div className='flex gap-4'>
            <Input
              className='flex-1 resize-none h-50'
              placeholder='Add some text as a basis for your vocabulary.'
              defaultValue={defaultInput}
              onChange={onChangeInput}
            />
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
          </div>
          <div className='flex flex-col flex-1 gap-2 justify-start align-start flex-wrap'>
            <h3 className='text-left text-sm font-medium'>Input as tokens</h3>
            <div className='flex flex-wrap gap-2'>
              {inputAsTokens.map((tokenIndex) => (
                <Token
                  key={`${tokenIndex}-${tokens[tokenIndex]}`}
                  token={tokens[tokenIndex]}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
