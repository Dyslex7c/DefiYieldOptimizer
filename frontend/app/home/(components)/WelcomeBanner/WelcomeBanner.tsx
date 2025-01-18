'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import styles from './WelcomeBanner.module.scss'
import { useAccount } from 'wagmi'
import abi from '../../layouts/Deposit/depositABI'

const contractAddress = '0x0747c4BD8F6a46F4E175CCB86d2B8a0D765cbA80'

export default function WelcomeBanner() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const { address, isConnected } = useAccount()
  const [portfolioStatus, setPortfolioStatus] = useState({
    totalDeposits: 0,
    currentAPY: 8.5,
    earnings: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (isConnected && address) {
        setWalletAddress(address)
        try {
          setIsLoading(true)
          setError(null)
          
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const contract = new ethers.Contract(contractAddress, abi, provider)
          
          const totalDeposits = await contract.totalDeposits()
          const userDeposit = await contract.getUserDeposit(address)
          
          const totalDepositsInAVAX = ethers.utils.formatEther(totalDeposits)
          const userDepositInAVAX = ethers.utils.formatEther(userDeposit.depositAmount)
          
          // Assuming 1 AVAX = $20 USD for this example
          const avaxPrice = 20
          const totalDepositsUSD = parseFloat(totalDepositsInAVAX) * avaxPrice
          const userDepositUSD = parseFloat(userDepositInAVAX) * avaxPrice
          
          // Calculate earnings based on APY
          const currentTimestamp = Math.floor(Date.now() / 1000)
          const lastDepositTime = userDeposit.lastDepositTime.toNumber()
          const timeSinceDeposit = Math.max(currentTimestamp - lastDepositTime, 0) 
          const yearInSeconds = 365 * 24 * 60 * 60
          
          let earnings = 0
          if (userDepositUSD > 0 && timeSinceDeposit > 0) {
            const earningsRatio = (portfolioStatus.currentAPY / 100) * (timeSinceDeposit / yearInSeconds)
            earnings = userDepositUSD * earningsRatio

            // Ensure minimum earnings of $0.01 if there's a deposit
            if (earnings < 0.01) {
              earnings = 0.01
            }
          }

          setPortfolioStatus({
            totalDeposits: userDepositUSD,
            currentAPY: portfolioStatus.currentAPY,
            earnings: earnings
          })
        } catch (err) {
          console.error('Error fetching data:', err)
          setError('Failed to fetch portfolio data. Please try again later.')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [isConnected, address])

  if (isLoading) {
    return <div className={styles.loading}>Loading portfolio data...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.welcomeBanner}>
      <h1 className={styles.greeting}>
        {walletAddress ? `Welcome, ${walletAddress}` : 'Connect your wallet to get started'}
      </h1>
      {walletAddress && (
        <div className={styles.portfolioOverview}>
          <div className={styles.stat}>
            <span className={styles.label}>Your Deposits</span>
            <span className={styles.value}>
              ${portfolioStatus.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Current APY</span>
            <span className={styles.value}>{portfolioStatus.currentAPY}%</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Earnings</span>
            <span className={styles.value}>
              ${portfolioStatus.earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
