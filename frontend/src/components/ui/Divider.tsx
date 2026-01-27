interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Divider = ({ className = '', orientation = 'vertical' }: DividerProps) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={`w-[1px] h-[14px] bg-[#E5E7EB] shrink-0 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`h-[1px] w-full bg-[#e5e7eb] ${className}`}
      aria-hidden="true"
    />
  );
};
