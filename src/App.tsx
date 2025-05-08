import './index.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Input } from './components/ui/input';
import { Token } from './components/ui/token';
import { Button } from './components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useIsDark } from './hooks/useIsDark';

const defaultInput = 'Hello, world!';

export function App() {
  const [isDark, setIsDark] = useIsDark();

  const [input, setInput] = useState(defaultInput);
  const [inputAsTokens, setInputAsTokens] = useState<number[]>([]);
  const [tokens, setTokens] = useState<string[]>(
    Array.from(new Set(defaultInput)),
  );

  const onChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    setTokens(Array.from(new Set(input)));
  }, [input]);

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
        <CardContent className='pt-6'>
          <div className='flex gap-4'>
            <Input
              className='flex-1 resize-none h-50'
              rows={12}
              placeholder='Add some text as a basis for your vocabulary.'
              defaultValue={defaultInput}
              onChange={onChangeInput}
            />
            <div className='flex flex-col flex-1 gap-2 justify-start align-start flex-wrap'>
              <h3 className='text-left text-sm font-medium'>Tokens</h3>
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
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
