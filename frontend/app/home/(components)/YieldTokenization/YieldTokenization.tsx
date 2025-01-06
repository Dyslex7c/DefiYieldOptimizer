'use client'

import { useState, useEffect } from 'react'
import { Coins, ArrowRight, RefreshCw } from 'lucide-react'
import styles from './YieldTokenization.module.scss'

interface YieldToken {
  name: string
  balance: number
  apy: number
}

export default function YieldTokenization() {
  const [yieldTokens,setYieldTokens] = useState<YieldToken[]>([])
  const [selectedToken, setSelectedToken] = useState<YieldToken | null>(null)
  const [actionAmount, setActionAmount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchYieldTokens = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setYieldTokens([
        { name: 'yAVAX', balance: 100, apy: 8.5 },
        { name: 'yETH', balance: 10, apy: 7.2 },
        { name: 'yUSDC', balance: 5000, apy: 6.8 },
      ])
      setIsLoading(false)
    }

    fetchYieldTokens()
  }, [])

  const handleAction = (action: 'redeem' | 'transfer') => {
    if (!selectedToken) return
    // In a real application, this would call a smart contract function
    console.log(`${action} ${actionAmount} ${selectedToken.name}`)
  }

  if (isLoading) {
    return (
      <div className={styles.yieldTokenization}>
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Loading yield tokens...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.yieldTokenization}>
      <h2 className={styles.title}>
        Yield Tokenization
        <Coins className={styles.icon} />
      </h2>
      <div className={styles.content}>
        <div className={styles.tokenList}>
          {yieldTokens.map((token) => (
            <div
              key={token.name}
              className={`${styles.tokenItem} ${selectedToken?.name === token.name ? styles.selected : ''}`}
              onClick={() => setSelectedToken(token)}
            >
              <h3>{token.name}</h3>
              <p>Balance: {token.balance}</p>
              <p>APY: {token.apy}%</p>
            </div>
          ))}
        </div>
        {selectedToken && (
          <div className={styles.actionPanel}>
            <h3>Actions for {selectedToken.name}</h3>
            <input
              type="number"
              value={actionAmount}
              onChange={(e) => setActionAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className={styles.amountInput}
            />
            <div className={styles.actionButtons}>
              <button onClick={() => handleAction('redeem')}>
                <RefreshCw className={styles.icon} />
                Redeem
              </button>
              <button onClick={() => handleAction('transfer')}>
                <ArrowRight className={styles.icon} />
                Transfer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

