'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle } from 'lucide-react'
import styles from './RiskManagement.module.scss'

export default function RiskManagement() {
  const [riskScore, setRiskScore] = useState(50)
  const [safeMode, setSafeMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulating API call to fetch initial risk data
    const fetchRiskData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setRiskScore(50)
      setSafeMode(false)
      setIsLoading(false)
    }

    fetchRiskData()
  }, [])

  const handleRiskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRiskScore(Number(event.target.value))
  }

  const toggleSafeMode = () => {
    setSafeMode(!safeMode)
  }

  if (isLoading) {
    return (
      <div className={styles.riskManagement}>
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Analyzing risk profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.riskManagement}>
      <h2 className={styles.title}>
        Risk Management
        <Shield className={styles.icon} />
      </h2>
      <div className={styles.content}>
        <div className={styles.riskScoreIndicator}>
          <label htmlFor="riskScore">Risk Score: {riskScore}</label>
          <input
            type="range"
            id="riskScore"
            min="0"
            max="100"
            value={riskScore}
            onChange={handleRiskChange}
            className={styles.riskSlider}
          />
          <div className={styles.riskLevels}>
            <span>Low Risk</span>
            <span>High Risk</span>
          </div>
        </div>
        <div className={styles.safeModeToggle}>
          <label htmlFor="safeMode">Safe Mode</label>
          <input
            type="checkbox"
            id="safeMode"
            checked={safeMode}
            onChange={toggleSafeMode}
            className={styles.toggle}
          />
        </div>
        <div className={styles.strategyPreview}>
          <h3>
            <AlertTriangle className={styles.icon} />
            Strategy Preview
          </h3>
          <p>
            {safeMode
              ? "Low-risk strategy: Focus on stable coins and established protocols."
              : "Balanced strategy: Mix of stable and volatile assets for higher potential returns."}
          </p>
        </div>
      </div>
    </div>
  )
}

