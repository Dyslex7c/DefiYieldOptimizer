'use client'

import { useState, useEffect } from 'react'
import { Award, ArrowUpRight, RefreshCw } from 'lucide-react'
import styles from './Rewards.module.scss'

interface Reward {
  asset: string
  amount: number
  value: number
}

export default function Rewards() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    setIsLoading(true)
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setRewards([
      { asset: 'ETH', amount: 0.05, value: 150 },
      { asset: 'USDC', amount: 100, value: 100 },
      { asset: 'AVAX', amount: 2, value: 50 },
    ])
    setIsLoading(false)
  }

  const totalValue = rewards.reduce((sum, reward) => sum + reward.value, 0)

  return (
    <div className={styles.rewards}>
      <h2 className={styles.title}>
        Your Rewards
        <Award className={styles.icon} />
        <button onClick={fetchRewards} className={styles.refreshButton}>
          <RefreshCw size={20} />
        </button>
      </h2>
      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Fetching your rewards...</p>
        </div>
      ) : (
        <>
          <div className={styles.totalRewards}>
            <h3>Total Rewards Value</h3>
            <p>${totalValue.toFixed(2)}</p>
          </div>
          <div className={styles.rewardsList}>
            {rewards.map((reward, index) => (
              <div key={index} className={styles.rewardItem}>
                <div className={styles.assetInfo}>
                  <span className={styles.assetName}>{reward.asset}</span>
                  <span className={styles.assetAmount}>{reward.amount} {reward.asset}</span>
                </div>
                <div className={styles.assetValue}>
                  ${reward.value.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <button className={styles.claimButton}>
            Claim All Rewards <ArrowUpRight className={styles.icon} />
          </button>
        </>
      )}
    </div>
  )
}

