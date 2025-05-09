import { cn } from '@/lib/utils';
import type { ClassNameValue } from 'tailwind-merge';

function Token({
  token,
  hovered,
  selected,
  className,
}: {
  token: string;
  hovered?: boolean;
  selected?: boolean;
  className?: ClassNameValue;
}) {
  const hoverClass = 'bg-gray-500';
  const selectedClass = 'bg-pink-500';

  return (
    <div
      className={cn(
        'select-none text-sm bg-muted rounded-md px-2 py-1',
        className,
        hovered && hoverClass,
        selected && selectedClass,
      )}
    >
      <pre>{token}</pre>
    </div>
  );
}

export { Token };
