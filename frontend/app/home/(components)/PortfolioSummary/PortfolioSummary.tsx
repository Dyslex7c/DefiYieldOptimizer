'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Wallet, DollarSign, TrendingUp } from 'lucide-react'
import { ethers } from 'ethers'
import styles from './PortfolioSummary.module.scss'
import abi from '../../layouts/Deposit/depositABI'
import { useAccount } from 'wagmi'

interface Asset {
  name: string
  symbol: string
  amount: number
  value: number
  change24h: number
  image: string
}

interface PortfolioData {
  totalValue: number
  totalChange24h: number
  dailyYield: number
  apy: number
  assets: Asset[]
}

const CONTRACT_ADDRESS = '0x0747c4BD8F6a46F4E175CCB86d2B8a0D765cbA80'

export default function PortfolioSummary() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useAccount()

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        // Connect to the Avalanche C-Chain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
        
        // Fetch user's AVAX deposit from the contract
        const userDeposit = await contract.getUserDeposit(address)
        const avaxAmount = ethers.utils.formatEther(userDeposit.depositAmount)

        // Fetch AVAX price from CoinGecko
        const avaxPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd')
        const avaxPriceData = await avaxPriceResponse.json()
        const avaxPrice = avaxPriceData['avalanche-2'].usd

        const avaxValue = parseFloat(avaxAmount) * avaxPrice

        const mockData: Omit<PortfolioData, 'assets'> = {
          totalValue: avaxValue + 14687.50 + 2767.17, // AVAX + PNG + USDC
          totalChange24h: 3.2,
          dailyYield: 15.75,
          apy: 9.8,
        }

        // Fetch real-time data for assets including icons
        const assets = [
          { id: 'avalanche-2', symbol: 'AVAX', amount: parseFloat(avaxAmount), value: avaxValue, change24h: 4.2 },
          { id: 'pangolin', symbol: 'PNG', amount: 2500, value: 14687.50, change24h: 3.5 },
          { id: 'usd-coin', symbol: 'USDC', amount: 2767.17, value: 2767.17, change24h: 0 },
        ]

        const assetData = await Promise.all(
          assets.map(async (asset) => {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${asset.id}`)
            const data = await response.json()
            return {
              ...asset,
              name: data.name,
              image: data.image.small,
            }
          })
        )

        setPortfolioData({ ...mockData, assets: assetData })
      } catch (err) {
        console.error('Error fetching portfolio data:', err)
        setError('Failed to fetch portfolio data. Please try again later.')
      }
    }

    fetchPortfolioData()
  }, [])

  if (error) return <div className={styles.error}>{error}</div>
  if (!portfolioData) return <div className={styles.loading}>Loading...</div>

  return (
    <motion.div 
      className={styles.portfolioSummary}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.title}>Portfolio Summary</h2>
      <div className={styles.overviewGrid}>
        <div className={styles.overviewItem}>
          <Wallet className={styles.icon} />
          <span className={styles.label}>Total Value</span>
          <span className={styles.value}>${portfolioData.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className={`${styles.change} ${portfolioData.totalChange24h >= 0 ? styles.positive : styles.negative}`}>
            {portfolioData.totalChange24h >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(portfolioData.totalChange24h)}%
          </span>
        </div>
        <div className={styles.overviewItem}>
          <DollarSign className={styles.icon} />
          <span className={styles.label}>Daily Yield</span>
          <span className={styles.value}>${portfolioData.dailyYield.toFixed(2)}</span>
        </div>
        <div className={styles.overviewItem}>
          <TrendingUp className={styles.icon} />
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
              <th>24h Change</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.assets.map((asset, index) => (
              <motion.tr 
                key={asset.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td>
                  <div className={styles.assetInfo}>
                    <img src={asset.image || "/placeholder.svg"} alt={asset.name} className={styles.assetIcon} />
                    <span>{asset.name}</span>
                  </div>
                </td>
                <td>{asset.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {asset.symbol}</td>
                <td>${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className={`${styles.change} ${asset.change24h >= 0 ? styles.positive : styles.negative}`}>
                  {asset.change24h >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(asset.change24h)}%
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

