import React, { useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ChartContainer } from "@/components/ui/chart";

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 16}
        fill={fill}
        opacity={0.3}
      />
      <text
        x={cx}
        y={cy - 20}
        textAnchor="middle"
        fill="#fff"
        className="text-lg font-bold"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fill="#fff"
        className="text-md"
      >
        {`${value}%`}
      </text>
    </g>
  );
};

const TokenomicsChart: React.FC = React.memo(() => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const data = [
    { name: "Governance", value: 30 },
    { name: "Ecosystem Growth", value: 25 },
    { name: "Team & Advisors", value: 20 },
    { name: "Community Rewards", value: 15 },
    { name: "Reserve", value: 10 },
  ];

  const COLORS = ['#4C6EF5', '#7C3AED', '#EC4899', '#F43F5E', '#0EA5E9'];

  return (
    <div className="grid gap-8 md:grid-cols-[1fr,auto]">
      <div className="relative min-h-[400px]">
        <ChartContainer
          config={{
            governance: {
              label: "Governance",
              color: "hsl(240, 100%, 60%)",
            },
            ecosystem: {
              label: "Ecosystem Growth",
              color: "hsl(280, 100%, 60%)",
            },
            team: {
              label: "Team & Advisors",
              color: "hsl(320, 100%, 60%)",
            },
            community: {
              label: "Community Rewards",
              color: "hsl(360, 100%, 60%)",
            },
            reserve: {
              label: "Reserve",
              color: "hsl(200, 100%, 60%)",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer>
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`gradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${index})`}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <div className="flex flex-col justify-center gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">
                {data[activeIndex].name}
              </h3>
              <Badge variant="secondary" className="text-lg">
                {data[activeIndex].value}%
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {[
                "Governance participation and voting rights",
                "Platform development and ecosystem expansion",
                "Team compensation and advisory rewards (vested)",
                "Community incentives and rewards programs",
                "Strategic reserve for future initiatives",
              ][activeIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

TokenomicsChart.displayName = 'TokenomicsChart';

export default TokenomicsChart;

