'use client';

import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

const footerLinks = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Products', href: ROUTES.PRODUCTS },
  { label: 'Company', href: ROUTES.ABOUT },
  { label: 'Contact', href: '#' },
];

export const Footer = () => {
  return (
    <footer className="bg-[#f9fafb] flex gap-[80px] items-start px-[80px] py-[90px] w-full">
      <div className="flex items-center justify-center p-[10px] shrink-0">
        <p className="font-cardo text-[32px] text-[#1f2937] leading-[normal] whitespace-nowrap">
          UNICORN
        </p>
      </div>

      <div className="flex flex-col gap-[27px] items-start shrink-0 flex-1">
        <nav className="flex gap-[80px] items-center shrink-0">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-suit font-bold text-[16px] text-[rgba(18,18,18,0.5)] leading-[1.5] whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-[8px] items-start shrink-0 w-full">
          <div className="flex gap-[10px] items-center shrink-0 w-full">
            <p className="font-suit text-[14px] text-[rgba(18,18,18,0.5)] leading-[1.5] whitespace-pre-wrap">
              05029 서울특별시 광진구 능동로 120 신공학관 1F
            </p>
            <span className="font-suit text-[14px] text-[rgba(18,18,18,0.5)] leading-[1.5] whitespace-pre-wrap">
              |
            </span>
            <p className="font-suit text-[14px] text-[rgba(18,18,18,0.5)] leading-[1.5] whitespace-nowrap">
              E-mail: unicorn@gmail.com
            </p>
            <span className="font-suit text-[14px] text-[rgba(18,18,18,0.5)] leading-[1.5] whitespace-pre-wrap">
              |
            </span>
            <p className="font-suit text-[14px] text-[rgba(18,18,18,0.5)] leading-[1.5] whitespace-pre-wrap">
              Tel: 02-540-0003
            </p>
          </div>
          <p className="font-suit text-[14px] text-[#959da5] leading-[1.5] whitespace-pre-wrap">
            Copyright © 2025 Unicorn All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
