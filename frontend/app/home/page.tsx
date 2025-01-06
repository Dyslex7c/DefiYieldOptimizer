"use client"

import { useEffect, useState } from "react"
import WelcomeBanner from "./(components)/WelcomeBanner/WelcomeBanner"
import NavigationPanel from './(components)/NavigationPanel/NavigationPanel'
import PortfolioSummary from './(components)/PortfolioSummary/PortfolioSummary'
import LiveAPYTracker from './(components)/LiveAPYTracker/LiveAPYTracker'
import DynamicRebalancing from './(components)/DynamicRebalancing/DynamicRebalancing'
import RiskManagement from './(components)/RiskManagement/RiskManagement'
import GovernancePanel from './(components)/GovernancePanel/GovernancePanel'
import YieldTokenization from './(components)/YieldTokenization/YieldTokenization'
import CrossChainInteraction from './(components)/CrossChainInteraction/CrossChainInteraction'
import Gamification from './(components)/Gamification/Gamification'

import styles from './page.module.scss'
import Deposit from "./layouts/Deposit/Deposit"
import Withdraw from "./layouts/Withdraw/Withdraw"
import Rewards from "./layouts/Rewards/Rewards"

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your Web3 Yield Aggregator...</p>
      </div>
    )
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            <PortfolioSummary />
            <LiveAPYTracker />
            <DynamicRebalancing />
            <RiskManagement />
            <GovernancePanel />
            <YieldTokenization />
            <CrossChainInteraction />
            <Gamification />
          </>
        )
      case 'deposit':
        return <Deposit />
      case 'withdraw':
        return <Withdraw />
      case 'rewards':
        return <Rewards />
      default:
        return (
          <>
            <PortfolioSummary />
            <LiveAPYTracker />
            <DynamicRebalancing />
            <RiskManagement />
            <GovernancePanel />
            <YieldTokenization />
            <CrossChainInteraction />
            <Gamification />
          </>
        )
    }
  }

  return (
    <div>
      <WelcomeBanner />
      <NavigationPanel activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className={styles.container}>
        {renderActiveSection()}
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
  )
}

