'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { PiggyBank, ArrowRight } from 'lucide-react'
import styles from './Deposit.module.scss'
import abi from './depositABI'

// Address of the deployed DepositContract
const depositContractAddress = "0x7E2056f7A8c7d0a88D426a73eD9eF00193157605"

export default function Deposit() {
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState('')

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (asset !== 'AVAX') {
      alert("Currently, only AVAX deposits are supported.")
      return
    }

    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed.")
      
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(depositContractAddress, abi, signer)

      // Convert amount to Wei (1 AVAX = 10^18 Wei)
      const weiAmount = ethers.utils.parseEther(amount)

      // Call the deposit function with the entered amount
      const tx = await contract.deposit({ value: weiAmount })
      await tx.wait()

      console.log(`Deposited ${amount} AVAX`)
      alert(`Successfully deposited ${amount} AVAX`)

    } catch (error) {
      console.error("Error during deposit:", error)
      alert("An error occurred during the deposit.")
    }
  }

  return (
    <div className={styles.deposit}>
      <h2 className={styles.title}>
        Deposit Funds
        <PiggyBank className={styles.icon} />
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
            <option value="AVAX">AVAX</option>
            {/* Other options can be added later */}
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
