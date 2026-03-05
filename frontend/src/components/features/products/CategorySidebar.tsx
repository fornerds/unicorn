'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';

interface CategoryItem {
  id: string;
  label: string;
  value: string;
}

const categories: CategoryItem[] = [
  { id: 'home', label: 'Home', value: 'HOME' },
  { id: 'firefighting', label: 'Firefighting', value: 'FIREFIGHTING' },
  { id: 'industrial', label: 'Industrial', value: 'INDUSTRIAL' },
  { id: 'medical', label: 'Medical', value: 'MEDICAL' },
  { id: 'logistics', label: 'Logistics', value: 'LOGISTICS' },
];

export const CategorySidebar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get('category') || '';

  const handleCategoryClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === selectedCategory) {
      params.delete('category');
    } else {
      params.set('category', value);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-[24px] items-start w-[186px] shrink-0">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.value;
        return (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.value)}
            className={cn(
              'flex gap-[4px] items-center p-[10px] w-full',
              isSelected && 'text-[#28292c]',
              !isSelected && 'text-[#adb3bf]'
            )}
          >
            <p className="font-suit font-medium text-[24px] leading-[1.5] whitespace-nowrap">
              {category.label}
            </p>
            {isSelected && (
              <div className="flex items-center justify-center py-[3px] shrink-0">
                <div className="w-[5px] h-[5px] rounded-full bg-[#28292c]" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
