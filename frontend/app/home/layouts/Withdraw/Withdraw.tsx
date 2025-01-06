'use client'

import { useState } from 'react'
import { ArrowDownCircle, AlertTriangle } from 'lucide-react'
import styles from './Withdraw.module.scss'
import { Input } from '@/components/ui/input'

export default function Withdraw() {
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState('')

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle withdraw logic here
    console.log(`Withdrawing ${amount} ${asset}`)
  }

  return (
    <div className={styles.withdraw}>
      <h2 className={styles.title}>
        Withdraw Funds
        <ArrowDownCircle className={styles.icon} />
      </h2>
      <form onSubmit={handleWithdraw} className={styles.withdrawForm}>
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
            <option value="AVAX">AVAX</option>
          </select>
        </div>
        <button type="submit" className={styles.withdrawButton}>
          Withdraw <ArrowDownCircle className={styles.icon} />
        </button>
      </form>
      <div className={styles.withdrawInfo}>
        <h3>
          <AlertTriangle className={styles.icon} />
          Important Information
        </h3>
        <p>Withdrawing funds may affect your overall yield earnings. Please note that some protocols may have withdrawal fees or lockup periods. Ensure you understand the implications before proceeding with your withdrawal.</p>
      </div>
    </div>
  )
}

