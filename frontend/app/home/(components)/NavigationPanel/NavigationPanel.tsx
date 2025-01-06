'use client'

import Link from 'next/link'
import { Home, PiggyBank, ArrowDownCircle, Award } from 'lucide-react'
import styles from './NavigationPanel.module.scss'

interface NavigationPanelProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function NavigationPanel({ activeSection, setActiveSection }: NavigationPanelProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'deposit', label: 'Deposit', icon: PiggyBank },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowDownCircle },
    { id: 'rewards', label: 'Rewards', icon: Award },
  ]

  return (
    <nav className={styles.navigationPanel}>
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={`#${item.id}`}
          className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
          onClick={() => setActiveSection(item.id)}
        >
          <item.icon className={styles.icon} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

