"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10 ${className}`}
    >
      {items.map((item, idx) => (
        <CardContainer
          key={item.title}
          className="relative group cursor-pointer"
        >
          <CardBody className="relative z-10 p-8 rounded-xl bg-transparent h-full shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 border-2 border-cyan-400">
            <CardItem
              translateZ="200"
              className="text-5xl mb-4 text-blue-500 group-hover:text-blue-400 transition-colors duration-300"
            >
              <Image
                height={300}
                width={300}
                src={item.icon}
                alt={`${item.icon}`}
              />
            </CardItem>
            <CardItem
              as="h3"
              translateZ="150"
              className="text-xl font-bold mb-2 text-white transition-colors duration-300"
            >
              {item.title}
            </CardItem>
            <CardItem
              as="p"
              translateZ="150"
              className="text-sm text-slate-300 group-hover:text-white transition-colors duration-300"
            >
              {item.description}
            </CardItem>
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
};

