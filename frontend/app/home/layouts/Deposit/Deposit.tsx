'use client'

import { useState } from 'react'
import { PiggyBank, ArrowRight } from 'lucide-react'
import styles from './Deposit.module.scss'

export default function Deposit() {
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState('')

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle deposit logic here
    console.log(`Depositing ${amount} ${asset}`)
  }

  return (
    <div className={styles.deposit}>
      <h2 className={styles.title}>
        <PiggyBank className={styles.icon} />
        Deposit Funds
      </h2>
      <form onSubmit={handleDeposit} className={styles.depositForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="asset">Asset</label>
          <select
            id="asset"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            required
          >
            <option value="">Select an asset</option>
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
            <option value="DAI">DAI</option>
          </select>
        </div>
        <button type="submit" className={styles.depositButton}>
          Deposit <ArrowRight className={styles.icon} />
        </button>
      </form>
      <div className={styles.depositInfo}>
        <h3>Why Deposit?</h3>
        <p>Depositing your assets allows you to earn yield through our optimized strategies. Your funds are automatically allocated to the best performing protocols to maximize your returns.</p>
      </div>
    </div>
  )
}

