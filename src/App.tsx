import './index.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Input } from './components/ui/input';

export function App() {
  const [input, setInput] = useState('');
  const [tokens, setTokens] = useState<Set<string>>(new Set());

  const onChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setTokens(new Set(e.target.value));
  };

  return (
    <div className='container mx-auto p-8 text-center relative z-10'>
      <Card className='bg-card/50 backdrop-blur-sm border-muted'>
        <CardHeader>
          <CardTitle>Byte Pair Encoding</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='flex gap-4'>
            <Input
              className='resize-none h-50'
              rows={12}
              placeholder='Add some text as a basis for your vocabulary.'
              onChange={onChangeInput}
            />
            <div className='flex flex-col gap-2'>
              <p>{input}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
