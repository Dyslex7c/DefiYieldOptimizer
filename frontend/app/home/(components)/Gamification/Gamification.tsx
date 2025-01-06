'use client'

import { useState, useEffect } from 'react'
import styles from './Gamification.module.scss'

interface Achievement {
  id: number
  name: string
  description: string
  earned: boolean
}

interface LeaderboardEntry {
  address: string
  earnings: number
}

export default function Gamification() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    // Simulating API calls to fetch achievements and leaderboard data
    const fetchAchievements = () => {
      const mockAchievements: Achievement[] = [
        { id: 1, name: "First Deposit", description: "Make your first deposit", earned: true },
        { id: 2, name: "Yield Master", description: "Earn 1000 AVAX in yields", earned: false },
        { id: 3, name: "Governance Guru", description: "Participate in 10 governance votes", earned: false },
      ]
      setAchievements(mockAchievements)
    }

    const fetchLeaderboard = () => {
      const mockLeaderboard: LeaderboardEntry[] = [
        { address: "0x1234...5678", earnings: 5000 },
        { address: "0x8765...4321", earnings: 4500 },
        { address: "0x2468...1357", earnings: 4000 },
      ]
      setLeaderboard(mockLeaderboard)
    }

    fetchAchievements()
    fetchLeaderboard()
  }, [])

  return (
    <div className={styles.gamification}>
      <h2 className={styles.title}>Achievements & Leaderboard</h2>
      <div className={styles.achievementsContainer}>
        <h3>Your Achievements</h3>
        <div className={styles.achievements}>
          {achievements.map((achievement) => (
            <div key={achievement.id} className={`${styles.achievement} ${achievement.earned ? styles.earned : ''}`}>
              <span className={styles.name}>{achievement.name}</span>
              <span className={styles.description}>{achievement.description}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.leaderboardContainer}>
        <h3>Top Earners</h3>
        <div className={styles.leaderboard}>
          {leaderboard.map((entry, index) => (
            <div key={index} className={styles.leaderboardEntry}>
              <span className={styles.rank}>#{index + 1}</span>
              <span className={styles.address}>{entry.address}</span>
              <span className={styles.earnings}>{entry.earnings} AVAX</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

