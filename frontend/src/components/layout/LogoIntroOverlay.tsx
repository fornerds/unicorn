'use client';

import { useEffect, useRef, useState } from 'react';
import { useAnimate } from 'framer-motion';
import { useHeader } from '@/contexts/HeaderContext';

export const LogoIntroOverlay = () => {
  const {
    showInitialAnimation,
    setLogoAnimationComplete,
    setIntroOverlayVisible,
  } = useHeader();
  const [scope, animate] = useAnimate();
  const hasRun = useRef(false);
  const [visible, setVisible] = useState(false);

  // Step 1: When showInitialAnimation becomes true, mount the DOM
  useEffect(() => {
    if (showInitialAnimation && !hasRun.current) {
      setVisible(true);
      setIntroOverlayVisible(true);
    }
  }, [showInitialAnimation, setIntroOverlayVisible]);

  // Step 2: Once visible (DOM is mounted), run the animation
  useEffect(() => {
    if (!visible || hasRun.current) return;
    hasRun.current = true;

    // Wait one frame so the scope ref is attached to the rendered DOM
    requestAnimationFrame(() => {
      const runAnimation = async () => {
        // Set initial centering via framer-motion (instant, no CSS transform conflict)
        animate('#intro-logo', { x: '-50%', y: '-50%' }, { duration: 0 });

        // Phase 1: Fade In (1.0s) — logo appears at center, 128px
        await animate(
          '#intro-logo',
          { opacity: 1 },
          { duration: 1.0, ease: 'easeOut' },
        );

        // Phase 2: Hold (0.4s)
        await new Promise((r) => setTimeout(r, 400));

        // Phase 3: Shrink & Move (1.2s) — 128px→32px, center→header position
        // Header logo position: px-[60px] + p-[10px] = left ~70px, py-[20px] + p-[10px] = top ~30px
        await animate(
          '#intro-logo',
          {
            fontSize: '32px',
            top: '30px',
            left: '70px',
            x: 0,
            y: 0,
          },
          { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
        );

        // Phase 4: Overlay Fade (0.3s) — overlay disappears, header fades in
        await animate(
          '#intro-overlay',
          { opacity: 0 },
          { duration: 0.3, ease: 'easeOut' },
        );

        setLogoAnimationComplete(true);
        setIntroOverlayVisible(false);
        setVisible(false);
      };

      runAnimation();
    });
  }, [visible, animate, setLogoAnimationComplete, setIntroOverlayVisible]);

  if (!visible) return null;

  return (
    <div ref={scope} style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none' }}>
      <div
        id="intro-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'black',
        }}
      />
      <span
        id="intro-logo"
        className="font-cardo"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          fontSize: '128px',
          color: 'white',
          opacity: 0,
          whiteSpace: 'nowrap',
          lineHeight: 'normal',
          zIndex: 101,
        }}
      >
        UNICORN
      </span>
    </div>
  );
};
