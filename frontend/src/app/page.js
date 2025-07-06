'use client';
import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';
import { Parallax } from 'react-scroll-parallax';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import ShinyText from '../components/ShinyText';


export default function Home() {
  const router = useRouter();
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 20);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);


  useEffect(() => {
    if (!vantaEffect) {
      import('vanta/dist/vanta.clouds.min').then((VANTA) => {
        const effect = VANTA.default({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          speed: 0.5,
          skyColor: 0x96d1e8,
  cloudColor: 0xdde6f4,
  cloudShadowColor: 0x365572,
  sunColor: 0xffa93e,
  sunGlareColor: 0xfc7e56,
  sunlightColor: 0xfcad5d,    
        });
        setVantaEffect(effect);
      });
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);


  return (
    <div>
      {/* Navbar */}
      <motion.nav
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  className={`fixed top-0 left-0 right-0 z-50 p-2 flex justify-between items-center transition-colors duration-300 ${
    scrolled ? 'bg-white shadow-md' : 'bg-[#fffffc]'
  }`}
  
>
<div className="flex items-center space-x-3 ml-10">
  <img src="/logo.png" alt="Logo" className="h-11 w-14 -mt-2" />
  <div className="flex flex-col leading-none">
    <span className="text-3xl font-extrabold text-[#083254] tracking-widest">LEXENATE</span>
    <span className="text-xs tracking-[0.35em] text-[#3db8da]">PRECISION IN EVERY CLAUSE</span>
  </div>
</div>

  <div className="space-x-6 text-2xl -mt-1 mr-10 text-[#083254]">
    <a href="#how-it-works" className="hover:text-[#3db8da]">How it works</a>
    <a href="#why-us" className="hover:text-[#3db8da]">Why us</a>
    <a href="#feedback" className="hover:text-[#3db8da]">Feedback</a>
  </div>
</motion.nav>


      {/* Hero Section with Parallax */}
      <Parallax speed={-10}>
  <div className="w-[90%] max-w-7xl mx-auto mt-24 rounded-3xl overflow-hidden relative shadow-xl">
    {/* Vanta Background Container */}
    <div ref={vantaRef} className="relative min-h-[80vh] flex items-center justify-center">
      {/* Fade-in blur animation overlay */}
      <motion.div
        initial={{ backdropFilter: 'blur(20px)', opacity: 1 }}
        animate={{ backdropFilter: 'blur(0px)', opacity: 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-10 bg-white/10 pointer-events-none"
      />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-20 flex flex-col items-center justify-center text-center text-white px-10 py-16"
      >
        <ShinyText
          text="Welcome To LEXENATE!"
          speed={3}
          className="text-5xl sm:text-6xl md:text-7xl"
        />
        <ShinyText
          text="Effortlessly Generate Legal Documents Using Cutting-Edge Automation."
          speed={4}
          className="text-2xl sm:text-3xl mt-6 max-w-3xl"
        />
        <motion.button
          onClick={() => router.push('/choice_sel')}
          className="px-8 py-3 mt-8 rounded-full font-semibold relative overflow-hidden border border-white/30 bg-white/10 backdrop-blur-md shadow-lg "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShinyText text="Let's Get Started" speed={3} className="text-white text-2xl " />
        </motion.button>
      </motion.div>
    </div>
  </div>
</Parallax>

<div className="mt-24" />


      {/* Section Animations */}
      {[
        {
          id: "how-it-works",
          title: "How it works?",
          content: (
            <>
              {/* Heading Animation */}
              <motion.h2
                className="text-4xl font-semibold mb-20 text-[#083254]"
                initial={{ y: -50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                How it works?
              </motion.h2>
        
              {/* Steps Animation Grid */}
              <motion.div
                className="w-full px-[5%] grid grid-cols-1 md:grid-cols-3 gap-24 items-start mt-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.3,
                    },
                  },
                }}
              >
                {[
                  {
                    img: '/how1.png',
                    title: 'Choose Your Input',
                    desc: 'Type your notes or upload a DOCX file. AI will understand your input.',
                  },
                  {
                    img: '/how2.png',
                    title: 'AI-Based Generation',
                    desc: 'Our engine converts inputs to legal docs and contracts instantly.',
                  },
                  {
                    img: '/how3.png',
                    title: 'Verify & Add to Blockchain',
                    desc: 'Finalize and secure your contract with blockchain verification.',
                  },
                ].map((step, i) => (
                  <motion.div key={i} className="flex flex-col items-center text-center px-6">
                    <motion.img
                      src={step.img}
                      alt={step.title}
                      className="w-40 h-40 -mt-4 mb-15"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    />
                    <motion.h3
                      className="font-bold text-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      className="text-gray-600 text-m mt-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      viewport={{ once: true }}
                    >
                      {step.desc}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ),
        }
        
        ,
        {
          id: "why-us",
          title: "Why choose LEXENATE over others?",
          content: (
            <ul className="max-w-3xl mx-auto text-left space-y-4 text-gray-700">
              <li>✅ Fast and accurate legal document generation</li>
              <li>✅ Affordable and transparent pricing</li>
              <li>✅ No legal jargon—just plain English</li>
              <li>✅ Secure and private document handling</li>
            </ul>
          ),
        },
        {
          id: "feedback",
          title: "What our users say",
          content: (
            <p className="italic text-gray-700">
              “LEXENATE saved us hours in legal paperwork. Super intuitive and reliable!” — A. Verma
            </p>
          ),
        },
      ].map((section, i) => (
        <motion.section
  key={section.id}
  id={section.id}
  className={`py-20 text-center ${section.bg}`}
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: i * 0.2 }}
>
  <div className={section.id === 'how-it-works' ? '' : 'max-w-2xl mx-auto'}>
    {section.content}
  </div>
</motion.section>

      ))}

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-sm py-8 text-center space-y-2">
        <div className="space-x-4">
          <a href="#" className="hover:underline">Disclaimer</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms & Conditions</a>
        </div>
        <p>© {new Date().getFullYear()} LEXENATE. All rights reserved.</p>
      </footer>
    </div>
  );
}
