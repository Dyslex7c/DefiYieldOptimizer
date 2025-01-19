"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { BackgroundBeams } from "@/app/components/ui/background-beams";
import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";
import { WavyBackground } from "@/app/components/ui/wavy-background";
import { Sparkles } from "@/app/components/ui/sparkles";
import { Button } from "@/app/components/ui/button";
import { HoverEffect } from "@/app/components/ui/card-hover-effect";
import { SmoothScroll } from "./SmoothScroll";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import styles from "./LandingPage.module.scss";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TokenomicsChart from "./TokenomicsChart";
import HowItWorksStep from "./HowItWorksStep";
import { ArrowRight, Cpu, TrendingUp, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";

gsap.registerPlugin(ScrollTrigger);

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

export function LandingPage() {
  const [email, setEmail] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

const onPieEnter = (_: any, index: number) => {
  setActiveIndex(index);
};
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const tokenomicsRef = useRef(null);

  useEffect(() => {
    const featuresSection = featuresRef.current;
    const howItWorksSection = howItWorksRef.current;
    const tokenomicsSection = tokenomicsRef.current;

    gsap.from(featuresSection, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: featuresSection,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.from(howItWorksSection, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: howItWorksSection,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.from(tokenomicsSection, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: tokenomicsSection,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  const features = [
    {
      title: "Dynamic Rebalancing",
      description:
        "Automatically move funds across yield farms for optimal returns.",
      icon: "/image1.jpg",
    },
    {
      title: "Auto-Compounding",
      description: "Reinvest rewards periodically to maximize your APY.",
      icon: "/image2.jpg",
    },
    {
      title: "Risk Management",
      description:
        'Limit allocations to high-risk protocols and offer a "Safe Mode".',
      icon: "/image3.jpg",
    },
    {
      title: "Cross-Chain Yield Farming",
      description: "Access yield farms across multiple blockchains.",
      icon: "/image4.jpg",
    },
    {
      title: "Governance",
      description:
        "Participate in DAO voting for protocol upgrades and strategies.",
      icon: "/image5.jpg",
    },
    {
      title: "Social Investing",
      description: "Follow and mimic top-performing portfolios.",
      icon: "/image6.jpg",
    },
  ];

  const handleLaunch = () => {
    router.push("/home");
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <SmoothScroll>
      <div className={styles.landingPage}>
        <BackgroundBeams />

        <header className={styles.header}>
          <nav>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#how-it-works">How It Works</a>
              </li>
              <li>
                <a href="#tokenomics">Tokenomics</a>
              </li>
            </ul>
          </nav>
          <motion.div
            className="flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <ConnectButton />
          </motion.div>
        </header>

        <main>
        <section className={styles.hero}>
  <div className="container mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <h1 className="mb-6">
        <TextGenerateEffect words="DeFi Yield Optimizer" />
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
      >
        Maximize your returns with AI-powered yield farming on Avalanche
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex flex-col sm:flex-row justify-center items-center gap-4"
      >
        <Button
          onClick={handleLaunch}
          size="lg"
          className="text-white font-semibold rounded-full px-8 py-4 text-lg hover:bg-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
          style={{background: "linear-gradient(to right, #f52222, #0b0f96)"}}
        >
          Launch App
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="text-gray-200 border-gray-200 rounded-full px-8 py-4 text-lg hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-blue-600"
        >
          Learn More
        </Button>
      </motion.div>
    </motion.div>
  </div>
  <motion.div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 1.2 }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-200 animate-bounce"
    >
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  </motion.div>
</section>

          <section id="features" className={styles.features}>
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
      Key Features
    </h2>
    <div className="relative">
      <Sparkles
        className="absolute inset-0 pointer-events-none"
        color="rgba(59, 130, 246, 0.2)"
      />
      <HoverEffect items={features} />
    </div>
  </div>
</section>

          <section id="how-it-works" className={styles.howItWorks}>
  <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
    How It Works
  </h2>
  <div className={styles.steps}>
    <HowItWorksStep
      number={1}
      title="Deposit"
      description="Connect your wallet and deposit your tokens into our smart contract."
      icon={<Wallet className="text-blue-500" />}
      delay={0}
    />
    <HowItWorksStep
      number={2}
      title="Optimize"
      description="Our AI algorithm allocates your funds across the best-performing yield farms."
      icon={<Cpu className="text-purple-500" />}
      delay={0.2}
    />
    <HowItWorksStep
      number={3}
      title="Earn"
      description="Sit back and watch your returns grow with auto-compounding and rebalancing."
      icon={<TrendingUp className="text-green-500" />}
      delay={0.4}
    />
  </div>
</section>

          <section id="tokenomics" className={styles.tokenomics}>
  <h2 className="mb-8 text-4xl font-bold tracking-tight">
    Token Distribution
  </h2>
  <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className={styles.tokenChart}>
        <Sparkles className={styles.sparkles} />
        <TokenomicsChart />
      </div>
    </CardContent>
  </Card>
</section>

<section className={styles.cta}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-white">
            Ready to maximize your yields?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our early access list and be the first to experience the future of DeFi yield optimization.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="relative w-full max-w-md">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 px-4 bg-white/10 border border-blue-500/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              style={{background: "linear-gradient(to right, #ffffff, #003cff, #000080, #000000)"}}
            >
              Get Early Access
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
        </main>

        <footer className={styles.footer}>
          <p className="text-white">&copy; 2024 DeFi Yield Optimizer. All rights reserved.</p>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Twitter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Discord">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8Z"></path>
                <path d="M10 12h.01"></path>
                <path d="M16 12h.01"></path>
              </svg>
            </a>
            <a href="#" aria-label="GitHub">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}

