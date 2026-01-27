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
  { id: 'firefighting', label: 'FIREFIGHTING', value: 'FIREFIGHTING' },
  { id: 'industrial', label: 'INDUSTRIAL', value: 'INDUSTRIAL' },
  { id: 'medical', label: 'MEDICAL', value: 'MEDICAL' },
  { id: 'logistics', label: 'LOGISTICS', value: 'LOGISTICS' },
];

const subCategories: CategoryItem[] = [
  { id: 'human', label: 'Human', value: 'Human' },
  { id: 'quadruped', label: '4족보행', value: 'Quadruped' },
  { id: 'manipulator', label: 'Manipulator', value: 'Manipulator' },
  { id: 'wheeled', label: '바퀴형', value: 'Wheeled' },
];

export const CategorySidebar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get('category') || '';
  const selectedSubCategory = searchParams.get('subCategory') || '';

  const handleCategoryClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === selectedCategory) {
      params.delete('category');
    } else {
      params.set('category', value);
    }
    params.delete('subCategory');
    router.push(`/products?${params.toString()}`);
  };

  const handleSubCategoryClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === selectedSubCategory) {
      params.delete('subCategory');
    } else {
      params.set('subCategory', value);
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
      {selectedCategory && (
        <div className="flex flex-col gap-[10px] items-start w-full pl-[10px]">
          {subCategories.map((subCategory) => {
            const isSelected = selectedSubCategory === subCategory.value;
            return (
              <button
                key={subCategory.id}
                onClick={() => handleSubCategoryClick(subCategory.value)}
                className={cn(
                  'flex items-center p-[10px] w-full',
                  isSelected && 'text-[#28292c]',
                  !isSelected && 'text-[#adb3bf]'
                )}
              >
                <p className="font-suit font-medium text-[24px] leading-[1.5] whitespace-nowrap">
                  {subCategory.label}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
