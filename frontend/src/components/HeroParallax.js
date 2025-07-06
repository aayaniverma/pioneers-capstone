'use client';

import { Parallax } from 'react-scroll-parallax';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function HeroParallaxSection() {
  const router = useRouter();

  return (
    <div className="relative pt-24 min-h-screen overflow-hidden">
      <Parallax speed={-15}>
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-75"
          src="/hero_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </Parallax>

      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[80vh] text-white px-4">
        <motion.h1
          className="text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to LEXENATE
        </motion.h1>
        <motion.p
          className="text-xl mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Effortlessly generate legal documents using cutting-edge automation.
        </motion.p>
        <motion.button
          onClick={() => router.push('/choice_sel')}
          className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Let's Get Started
        </motion.button>
      </div>
    </div>
  );
}
