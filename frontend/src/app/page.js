'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Parallax } from 'react-scroll-parallax';
import ShinyText from '../components/ShinyText';
import WhyUsSection from '../components/WhyUsSection';

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - 100);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!hasMounted) return null;

  return (
    <div>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 p-2 flex justify-between items-center transition-colors duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-transparent'
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
        <div ref={heroRef} className="w-screen h-screen relative overflow-hidden">
          {hasMounted && (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
            >
              <source src="/bg-video3.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ backdropFilter: 'blur(20px)', opacity: 1 }}
              animate={{ backdropFilter: 'blur(0px)', opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 z-10 bg-white/10 pointer-events-none"
            />

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="relative z-20 flex mt-30 flex-col items-center justify-center text-center text-white px-10 py-16"
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
                className="px-8 py-3 mt-8 mb-40 rounded-full font-semibold relative overflow-hidden border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShinyText text="Let's Get Started" speed={3} className="text-white text-2xl" />
              </motion.button>

              <motion.div
                className="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-30 cursor-pointer pb-1"
                initial={{ y: 0 }}
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Parallax>

      <div className="mt-24" />

      {/* Sections */}
      {[
        {
          id: "how-it-works",
          content: (
            <>
              <motion.h2
                className="text-4xl font-semibold mb-20 text-[#083254]"
                initial={{ y: -50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                How it works?
              </motion.h2>
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
                  <motion.div key={i} className="flex items-center justify-center flex-col text-center px-6 min-h-[50vh]">
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
        },
        {
          id: "why-us",
          content: <WhyUsSection />,
        },
        {
          id: "feedback",
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
          className={`py-20 text-center ${section.bg || ''}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
        >
          <div className={section.id === 'how-it-works' ? '' : 'w-full px-[5%]'}>
            {section.content}
          </div>
        </motion.section>
      ))}

      {/* Footer */}
      <footer className="bg-white text-black text-sm py-8 text-center space-y-2 shadow-[0_-4px_8px_-2px_rgba(0,0,0,0.1)]">
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
