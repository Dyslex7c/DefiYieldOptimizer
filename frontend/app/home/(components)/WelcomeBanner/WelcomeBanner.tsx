'use client'

import { useState, useEffect } from 'react'
import styles from './WelcomeBanner.module.scss'
import { useAccount } from 'wagmi';

export default function WelcomeBanner() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const { address, isConnected } = useAccount();
  const [portfolioStatus, setPortfolioStatus] = useState({
    totalDeposits: 0,
    currentAPY: 0,
    earnings: 0
  })

  useEffect(() => {
    setTimeout(() => {
      if (isConnected && address) {
        setWalletAddress(address);
        setPortfolioStatus({
          totalDeposits: 10000,
          currentAPY: 8.5,
          earnings: 850
        });
      }
    }, 1000);
  }, [isConnected, address]);

  return (
    <div className={styles.welcomeBanner}>
      <h1 className={styles.greeting}>
        {walletAddress ? `Welcome, ${walletAddress}` : 'Connect your wallet to get started'}
      </h1>
      {walletAddress && (
        <div className={styles.portfolioOverview}>
          <div className={styles.stat}>
            <span className={styles.label}>Total Deposits</span>
            <span className={styles.value}>${portfolioStatus.totalDeposits.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Current APY</span>
            <span className={styles.value}>{portfolioStatus.currentAPY}%</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Earnings</span>
            <span className={styles.value}>${portfolioStatus.earnings.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
