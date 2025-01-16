'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { ArrowDownCircle, AlertTriangle } from 'lucide-react'
import styles from './Withdraw.module.scss'
import abi from './withdrawABI'

// Address of the deployed WithdrawContract
const withdrawContractAddress = "0x0747c4BD8F6a46F4E175CCB86d2B8a0D765cbA80"

export default function Withdraw() {
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState('')

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    if (asset !== 'AVAX') {
      alert("Currently, only AVAX withdrawals are supported.")
      return
    }

    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed.")

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(withdrawContractAddress, abi, signer)

      // Convert amount to Wei (1 AVAX = 10^18 Wei)
      const weiAmount = ethers.utils.parseEther(amount)

      // Call the withdraw function with the entered amount
      const tx = await contract.withdraw(weiAmount)
      await tx.wait()

      console.log(`Withdrew ${amount} AVAX`)
      alert(`Successfully withdrew ${amount} AVAX`)

    } catch (error) {
      console.error("Error during withdrawal:", error)
      alert("An error occurred during the withdrawal.")
    }
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
            <option value="AVAX">AVAX</option>
            {/* Other options can be added later */}
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
