'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, DollarSign } from 'lucide-react'
import Image from 'next/image'
import styles from './LiveAPYTracker.module.scss'

interface APYData {
  protocol: string
  pool: string
  apy: number
}

export default function LiveAPYTracker() {
  const [apyData, setApyData] = useState<APYData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [protocolIcon, setProtocolIcon] = useState<string | null>(null)

  const fetchAPYData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://defi-yield-optimizer-three.vercel.app/highest-apy')
      const data: APYData = await response.json()
      setApyData(data)
      setProtocolIcon(`https://cryptologos.cc/logos/${data.protocol.toLowerCase()}-logo.png`)
    } catch (err) {
      console.error("Error fetching APY data:", err)
      setError("Failed to fetch APY data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAPYData()
    const interval = setInterval(fetchAPYData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.liveAPYTracker}>
      <h2 className={styles.title}>
        Highest APY DeFi Protocol
        <button onClick={fetchAPYData} className={styles.refreshButton}>
          <RefreshCw size={24} />
        </button>
      </h2>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && apyData && (
        <div className={styles.apyBoard}>
          <div className={styles.apyCard}>
            <div className={styles.flickeringBorder}></div>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                {protocolIcon && (
                  <div className={styles.protocolIcon}>
                    <Image src={protocolIcon || "/placeholder.svg"} alt={apyData.protocol} width={64} height={64} />
                  </div>
                )}
                <span className={styles.protocol}>{apyData.protocol}</span>
              </div>
              <div className={styles.apyInfo}>
                <TrendingUp size={24} className={styles.icon} />
                <span className={styles.apy}>{apyData.apy.toFixed(2)}% APY</span>
              </div>
              <div className={styles.poolInfo}>
                <DollarSign size={24} className={styles.icon} />
                <span className={styles.pool}>Pool: {apyData.pool}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

