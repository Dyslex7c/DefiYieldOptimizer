"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export const BackgroundBeams = () => {
  const tokenCount = 20;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-red-500 opacity-30" />
      {[...Array(tokenCount)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 200],
            y: [0, Math.random() * 200],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <Image
            src="/avax-token.png" // Make sure to add this image to your public folder
            alt="AVAX Token"
            width={24}
            height={24}
            className="opacity-50"
          />
        </motion.div>
      ))}
    </div>
  );
};

