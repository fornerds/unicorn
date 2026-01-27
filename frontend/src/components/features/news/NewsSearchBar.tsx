'use client';

import Image from 'next/image';

interface NewsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const NewsSearchBar = ({ value, onChange }: NewsSearchBarProps) => {
  return (
    <div className="border-b border-[#4b5563] flex items-end justify-between px-[2px] py-[6px] w-[344px]">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="원하는 내용을 검색해 보세요."
        className="flex-1 font-suit font-normal text-[18px] leading-[1.5] text-[#959ba9] bg-transparent border-none outline-none placeholder:text-[#959ba9]"
      />
      <div className="flex items-center justify-center p-[2px] rounded-[8px] w-[24px] h-[24px]">
        <Image
          src="/icons/search.svg"
          alt="검색"
          width={18}
          height={18}
          className="w-[18px] h-[18px]"
        />
      </div>
    </div>
  );
};
