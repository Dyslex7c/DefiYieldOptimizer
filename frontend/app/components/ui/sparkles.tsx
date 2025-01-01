"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const Sparkles = ({ className = "", ...props }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const createSparkle = () => {
      const sparkle = document.createElement("div");
      sparkle.className = "absolute bg-white rounded-full opacity-0";
      sparkle.style.width = `${Math.random() * 4 + 1}px`;
      sparkle.style.height = sparkle.style.width;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      ref.current?.appendChild(sparkle);

      setTimeout(() => {
        sparkle.style.opacity = "1";
        setTimeout(() => {
          sparkle.style.opacity = "0";
          setTimeout(() => {
            sparkle.remove();
          }, 300);
        }, 300);
      }, 10);
    };

    const interval = setInterval(createSparkle, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`absolute inset-0 ${className}`}
      {...props}
    />
  );
};

