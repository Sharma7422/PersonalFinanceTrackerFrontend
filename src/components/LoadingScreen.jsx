import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";

const coins = ["💰", "🪙", "💵", "💴", "💶", "💸"];

const FloatingCoin = ({ size, delay, xStart, yStart, duration }) => (
  <motion.div
    className="absolute text-2xl"
    style={{ left: xStart, top: yStart, fontSize: size }}
    animate={{ y: [-50, -window.innerHeight - 50] }}
    transition={{
      repeat: Infinity,
      repeatType: "loop",
      duration: duration,
      delay: delay,
      ease: "linear",
    }}
  >
    {coins[Math.floor(Math.random() * coins.length)]}
  </motion.div>
);

const LoadingScreen = () => {
  const [floatingCoins, setFloatingCoins] = useState([]);

  useEffect(() => {
    const tempCoins = Array.from({ length: 12 }).map(() => ({
      size: Math.random() * 24 + 20,
      delay: Math.random() * 3,
      xStart: Math.random() * window.innerWidth,
      yStart: Math.random() * window.innerHeight,
      duration: Math.random() * 4 + 4,
    }));
    setFloatingCoins(tempCoins);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-secondary/10 dark:from-gray-900 dark:to-gray-800 z-50 overflow-hidden">
      {/* Particle background */}
      <Particles
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
          },
          particles: {
            color: { value: ["#f59e0b", "#2563eb", "#22c55e", "#a855f7"] },
            shape: { type: "circle" },
            size: { value: { min: 3, max: 7 } },
            move: { enable: true, speed: 2, direction: "top", outModes: "out" },
            opacity: { value: 0.7 },
          },
        }}
      />

      {/* Floating coins */}
      {floatingCoins.map((coin, idx) => (
        <FloatingCoin key={idx} {...coin} />
      ))}

      {/* Central coin loader */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, yoyo: Infinity }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-20 h-20 bg-gradient-to-r from-primary to-secondary dark:from-gray-700 dark:to-gray-900 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-white text-3xl font-bold animate-pulse">💰</span>
        </motion.div>

        <motion.p
          className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-200"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          Loading Dashboard...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;