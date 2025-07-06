'use client';

import { ParallaxProvider } from 'react-scroll-parallax';

export default function ParallaxClientProvider({ children }) {
  return <ParallaxProvider>{children}</ParallaxProvider>;
}
