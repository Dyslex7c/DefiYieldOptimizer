'use client'

import { useState, useEffect } from 'react'
import styles from './PortfolioSummary.module.scss'

interface PortfolioData {
  totalValue: number
  dailyYield: number
  apy: number
  assets: { name: string; amount: number; value: number }[]
}

export default function PortfolioSummary() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)

  useEffect(() => {
    // Simulating API call to fetch portfolio data
    const fetchPortfolioData = () => {
      const mockData: PortfolioData = {
        totalValue: 25000,
        dailyYield: 12.5,
        apy: 8.2,
        assets: [
          { name: 'AVAX', amount: 100, value: 10000 },
          { name: 'ETH', amount: 5, value: 12500 },
          { name: 'USDC', amount: 2500, value: 2500 },
        ],
      }
      setPortfolioData(mockData)
    }

    fetchPortfolioData()
  }, [])

  if (!portfolioData) return <div>Loading...</div>

  return (
    <div className={styles.portfolioSummary}>
      <h2 className={styles.title}>Portfolio Summary</h2>
      <div className={styles.overviewGrid}>
        <div className={styles.overviewItem}>
          <span className={styles.label}>Total Value</span>
          <span className={styles.value}>${portfolioData.totalValue.toLocaleString()}</span>
        </div>
        <div className={styles.overviewItem}>
          <span className={styles.label}>Daily Yield</span>
          <span className={styles.value}>${portfolioData.dailyYield.toFixed(2)}</span>
        </div>
        <div className={styles.overviewItem}>
          <span className={styles.label}>Current APY</span>
          <span className={styles.value}>{portfolioData.apy.toFixed(2)}%</span>
        </div>
      </div>
      <div className={styles.assetsTable}>
        <h3>Your Assets</h3>
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Amount</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.assets.map((asset, index) => (
              <tr key={index}>
                <td>{asset.name}</td>
                <td>{asset.amount}</td>
                <td>${asset.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

