'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function WhyUsSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const cards = [
    {
      title: 'Instant Legal Automation',
      desc: 'Draft NDAs, M&A agreements, and more in seconds — reducing legal overhead and saving thousands in legal costs.',
      img: '/wph1.png',
    },
    {
      title: 'Tailored to Your Templates',
      desc: 'LEXENATE adapts to your internal document formats, ensuring every contract fits your legal and brand standards.',
      img: '/wph2.png',
    },
    {
      title: 'Smart Contract Validation',
      desc: 'Built-in AI checks and verifies legal clauses, structure, and required fields for compliance — before it’s signed.',
      img: '/wph3.png',
    },
    {
      title: 'Blockchain-Backed Integrity',
      desc: 'Every contract is time-stamped, hashed, and stored on-chain, ensuring tamper-proof audit trails and legal trust.',
      img: '/wph4.png',
    },
  ];
  

  // Animation Variants
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.2,
      },
    },
  };

  

  const headingVariants = {
    hidden: { opacity: 0, y: 80 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 14,
      },
    },
  };

  return (
    <section id="why-us" className="py-20 w-[90%] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Left Heading */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="md:w-1/3 w-full"
        >
          <h2 className="text-4xl font-semibold text-[#083254] text-left mb-4">
            Why choose <br /> LEXENATE?
          </h2>
          <p className="text-[#3e4e5e] text-left">
            Here’s how we stand out from other tools.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex w-full md:w-2/3 h-[400px] gap-4"
        >
          {cards.map((card, index) => {
            const isActive = hoveredIndex === index;
            return (
              <motion.div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative transition-all duration-500 rounded-2xl overflow-hidden shadow-lg cursor-pointer flex flex-col justify-end ${
                  isActive ? 'flex-[3]' : 'flex-[1.1]'
                }`}
                style={{ minWidth: isActive ? '100px' : '50px' }}
              >
                {/* Background Image */}
                <div
  className="absolute inset-0 bg-cover bg-center h-full w-full"
  style={{ backgroundImage: `url(${card.img})` }}
/>


                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />

                {/* Content */}
                <div className="relative z-20 p-6 mb-20 text-white text-center h-32 flex flex-col justify-start">
  <h3 className="text-2xl font-semibold mb-2">{card.title}</h3>
  <motion.p
    className="text-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: isActive ? 1 : 0 }}
    transition={{ duration: 0.3 }}
    style={{ height: isActive ? 'auto' : 0, overflow: 'hidden' }}
  >
    {card.desc}
  </motion.p>
</div>

              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}