"use client";
import React from "react";
import { motion } from "framer-motion";

export const WavyBackground = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M0 50 Q 25 0, 50 50 T 100 50' fill='none' stroke='rgba(59,130,246,0.2)' stroke-width='2'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
        animate={{
          y: ["0%", "-100%"],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M0 50 Q 25 100, 50 50 T 100 50' fill='none' stroke='rgba(147,51,234,0.2)' stroke-width='2'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
        animate={{
          y: ["0%", "-100%"],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 15,
          ease: "linear",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

