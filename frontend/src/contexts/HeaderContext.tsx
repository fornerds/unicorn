'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderContextType {
  isFirstSection: boolean;
  setIsFirstSection: (value: boolean) => void;
  showInitialAnimation: boolean;
  setShowInitialAnimation: (value: boolean) => void;
  logoAnimationComplete: boolean;
  setLogoAnimationComplete: (value: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [isFirstSection, setIsFirstSection] = useState(true);
  const [showInitialAnimation, setShowInitialAnimation] = useState(false);
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);

  return (
    <HeaderContext.Provider
      value={{
        isFirstSection,
        setIsFirstSection,
        showInitialAnimation,
        setShowInitialAnimation,
        logoAnimationComplete,
        setLogoAnimationComplete,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    return {
      isFirstSection: false,
      setIsFirstSection: () => {},
      showInitialAnimation: false,
      setShowInitialAnimation: () => {},
      logoAnimationComplete: false,
      setLogoAnimationComplete: () => {},
    };
  }
  return context;
};
