"use client";

import { cn } from "@/utils/cn";

interface NewsTagFilterProps {
  tags: string[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

export const NewsTagFilter = ({
  tags,
  selectedTag,
  onTagSelect,
}: NewsTagFilterProps) => {
  const mid = Math.ceil(tags.length / 2);
  const firstRow = tags.slice(0, mid);
  const secondRow = tags.slice(mid);

  const renderTag = (tag: string) => {
    const isSelected = tag === selectedTag;
    return (
      <button
        key={tag}
        onClick={() => onTagSelect(tag)}
        className={cn(
          "bg-[#f9fafb] border flex items-center justify-center px-[20px] py-[4px] rounded-[999px] transition-colors",
          isSelected
            ? "border-[#4b5563]"
            : "border-[#d1d5db] hover:border-[#4b5563]",
        )}
      >
        <span
          className={cn(
            "font-suit leading-[1.5] text-[15px] text-center whitespace-nowrap",
            isSelected
              ? "font-semibold text-[#4b5563]"
              : "font-normal text-[#959ba9]",
          )}
        >
          #{tag}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-[12px] items-center">
      <div className="flex flex-wrap gap-[8px] items-center justify-center">
        {firstRow.map(renderTag)}
      </div>
      {secondRow.length > 0 && (
        <div className="flex flex-wrap gap-[8px] items-center justify-center">
          {secondRow.map(renderTag)}
        </div>
      )}
    </div>
  );
};
