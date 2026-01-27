'use client';

export const NewsCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-t from-white from-[60.096%] to-[#fbfcfe] border border-[#eeeff1] flex flex-col h-[500px] items-center justify-between overflow-hidden pt-[20px] rounded-[12px] w-[378px] animate-pulse">
      <div className="flex items-center px-[20px] w-full">
        <div className="h-[21px] w-[100px] bg-[#e5e7eb] rounded" />
      </div>
      <div className="flex flex-col gap-[20px] items-start w-full">
        <div className="flex flex-col h-[140px] items-center justify-between px-[20px] w-full">
          <div className="flex flex-1 flex-col items-center justify-between w-full">
            <div className="flex flex-col gap-[8px] w-full">
              <div className="h-[28px] w-full bg-[#e5e7eb] rounded" />
              <div className="h-[28px] w-[80%] bg-[#e5e7eb] rounded" />
            </div>
            <div className="flex flex-col gap-[6px] w-full">
              <div className="h-[16px] w-full bg-[#e5e7eb] rounded" />
              <div className="h-[16px] w-[95%] bg-[#e5e7eb] rounded" />
              <div className="h-[16px] w-[90%] bg-[#e5e7eb] rounded" />
            </div>
          </div>
        </div>
        <div className="flex h-[270px] items-center justify-center overflow-hidden w-full">
          <div className="flex-1 h-full bg-[#e5e7eb] w-full" />
        </div>
      </div>
    </div>
  );
};
