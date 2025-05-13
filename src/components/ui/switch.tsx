// components/Switch.tsx
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { clsx } from 'clsx';

export function Switch({
  checked,
  onCheckedChange,
  className,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={clsx(
        'w-10 h-6 rounded-full relative transition-colors',
        checked ? 'bg-primary' : 'bg-gray-300',
        className,
      )}
    >
      <SwitchPrimitive.Thumb
        className={clsx(
          'block w-4 h-4 bg-white rounded-full shadow transition-transform',
          checked ? 'translate-x-4' : 'translate-x-1',
        )}
      />
    </SwitchPrimitive.Root>
  );
}
