'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { BackgroundBeams } from '@/app/components/ui/background-beams'
import { TextGenerateEffect } from '@/app/components/ui/text-generate-effect'
import { WavyBackground } from '@/app/components/ui/wavy-background'
import { Sparkles } from '@/app/components/ui/sparkles'
import { Button } from '@/app/components/ui/button'
import { HoverEffect } from '@/app/components/ui/card-hover-effect'
import { SmoothScroll } from './SmoothScroll'
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import styles from './LandingPage.module.scss'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRouter } from 'next/navigation'

gsap.registerPlugin(ScrollTrigger)

export function LandingPage() {
  const [email, setEmail] = useState('')
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)
  const tokenomicsRef = useRef(null)

  useEffect(() => {
    const featuresSection = featuresRef.current
    const howItWorksSection = howItWorksRef.current
    const tokenomicsSection = tokenomicsRef.current

    gsap.from(featuresSection, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: featuresSection,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    gsap.from(howItWorksSection, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: howItWorksSection,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    gsap.from(tokenomicsSection, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: tokenomicsSection,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })
  }, [])

  const features = [
    {
      title: 'Dynamic Rebalancing',
      description: 'Automatically move funds across yield farms for optimal returns.',
      icon: '/image1.jpg',
    },
    {
      title: 'Auto-Compounding',
      description: 'Reinvest rewards periodically to maximize your APY.',
      icon: '/image1.jpg',
    },
    {
      title: 'Risk Management',
      description: 'Limit allocations to high-risk protocols and offer a "Safe Mode".',
      icon: '/image1.jpg',
    },
    {
      title: 'Cross-Chain Yield Farming',
      description: 'Access yield farms across multiple blockchains.',
      icon: '/image1.jpg',
    },
    {
      title: 'Governance',
      description: 'Participate in DAO voting for protocol upgrades and strategies.',
      icon: '/image1.jpg',
    },
    {
      title: 'Social Investing',
      description: 'Follow and mimic top-performing portfolios.',
      icon: '/image1.jpg',
    },
  ]

  const handleLaunch = () => {
    router.push("/home");
  }

  return (
    <SmoothScroll>
    <div className={styles.landingPage}>
      <BackgroundBeams />
      
      <header className={styles.header}>
        <nav>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#tokenomics">Tokenomics</a></li>
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
          <WavyBackground className={styles.wavyBackground}>
            <h1>
              <TextGenerateEffect words="DeFi Yield Optimizer" />
            </h1>
            <p>Maximize your returns with yield farming on Avalanche</p>
          </WavyBackground>
            <Button onClick={handleLaunch}>
              Launch App
            </Button>
        </section>

        <section id="features" className={styles.features}>
          <h2>Key Features</h2>
          <HoverEffect items={features} />
        </section>

        <section id="how-it-works" className={styles.howItWorks}>
          <h2>How It Works</h2>
          <div className={styles.steps}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>1. Deposit</h3>
              <p>Connect your wallet and deposit your tokens into our smart contract.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3>2. Optimize</h3>
              <p>Our AI algorithm allocates your funds across the best-performing yield farms.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3>3. Earn</h3>
              <p>Sit back and watch your returns grow with auto-compounding and rebalancing.</p>
            </motion.div>
          </div>
        </section>

        <section id="tokenomics" className={styles.tokenomics}>
          <h2>Tokenomics</h2>
          <div className={styles.tokenChart}>
            <Sparkles className={styles.sparkles} />
            {/* Add your tokenomics chart or data here */}
            <div className={styles.tokenInfo}>
              <p>Total Supply: 100,000,000 DYOT</p>
              <p>Initial Circulating Supply: 20,000,000 DYOT</p>
              <p>Governance: 30%</p>
              <p>Ecosystem Growth: 25%</p>
              <p>Team & Advisors: 20% (vested over 3 years)</p>
              <p>Community Rewards: 15%</p>
              <p>Reserve: 10%</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Ready to maximize your yields?</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">Get Early Access</Button>
          </form>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 DeFi Yield Optimizer. All rights reserved.</p>
        <div className={styles.socialLinks}>
          <a href="#" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
          </a>
          <a href="#" aria-label="Discord">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8Z"></path><path d="M10 12h.01"></path><path d="M16 12h.01"></path></svg>
          </a>
          <a href="#" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
          </a>
        </div>
      </footer>
    </div>
    </SmoothScroll>
  )
}

