"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 ${className}`}
    >
      {items.map((item, idx) => (
        <div
          key={item.title}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <motion.div
            className="absolute inset-0 rounded-lg bg-slate-800 dark:bg-slate-800/[0.8] opacity-0 group-hover:opacity-100 transition duration-300"
            style={{
              scaleX: hoveredIndex === idx ? 1 : 0,
              scaleY: hoveredIndex === idx ? 1 : 0,
            }}
          ></motion.div>
          <div className="relative z-10 p-5 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 h-full">
            <div className="text-4xl mb-4">{item.icon}</div>
            <div className="text-lg font-bold mb-2 text-white">{item.title}</div>
            <p className="text-sm text-slate-400">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

