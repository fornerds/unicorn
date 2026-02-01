import { useState } from 'react';
import { cn } from '@/utils/cn';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Toggle = ({ checked: controlledChecked, onChange, label, disabled }: ToggleProps) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !checked;
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div className="flex gap-[10px] items-center justify-center px-[4px] py-[10px]">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'block h-[18px] overflow-hidden rounded-full w-[34px] transition-colors relative',
          checked ? 'bg-[#1F2937]' : 'bg-gray-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        aria-label={label}
        role="switch"
        aria-checked={checked}
      >
        <div
          className={cn(
            'absolute -translate-y-1/2 top-1/2 bg-white rounded-full shadow-[0px_0px_0px_0px_rgba(0,0,0,0.04),0px_3px_8px_0px_rgba(0,0,0,0.15),0px_3px_1px_0px_rgba(0,0,0,0.06)] w-[14px] h-[14px] transition-transform',
            checked ? 'right-[2px]' : 'left-[2px]'
          )}
        />
      </button>
      {label && (
        <span className="font-suit font-medium text-[16px] text-[#959ba9] leading-[1.6] whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
};
