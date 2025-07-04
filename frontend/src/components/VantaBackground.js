'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function VantaBackground() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    const loadVanta = async () => {
      const VANTA = await import('vanta/dist/vanta.fog.min.js');

      if (!vantaEffect) {
        setVantaEffect(
          VANTA.default({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  highlightColor: 0xffc748,
  midtoneColor: 0xf26f5c,
            lowlightColor: 0x5339d1,
            blurFactor: 0.58,
            speed: 0.40
          })
        );
      }
    };

    loadVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className="fixed inset-0 -z-10" />;
}
