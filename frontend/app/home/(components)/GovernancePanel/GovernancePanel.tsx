'use client'

import { useState, useEffect } from 'react'
import { Vote, CheckCircle, XCircle } from 'lucide-react'
import styles from './GovernancePanel.module.scss'

interface Proposal {
  id: number
  title: string
  description: string
  votesFor: number
  votesAgainst: number
  status: 'active' | 'passed' | 'rejected'
}

export default function GovernancePanel() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulating API call to fetch governance proposals
    const fetchProposals = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const mockProposals: Proposal[] = [
        {
          id: 1,
          title: "Increase AVAX allocation",
          description: "Proposal to increase AVAX allocation from 20% to 30% in the yield farming strategy.",
          votesFor: 1500000,
          votesAgainst: 500000,
          status: 'active'
        },
        {
          id: 2,
          title: "Add new yield farming pool",
          description: "Proposal to add a new yield farming pool for the AVAX-ETH pair.",
          votesFor: 2000000,
          votesAgainst: 100000,
          status: 'passed'
        },
        {
          id: 3,
          title: "Reduce platform fees",
          description: "Proposal to reduce platform fees from 0.5% to 0.3% for all users.",
          votesFor: 800000,
          votesAgainst: 1200000,
          status: 'rejected'
        },
      ]
      setProposals(mockProposals)
      setIsLoading(false)
    }

    fetchProposals()
  }, [])

  const handleVote = (proposalId: number, voteType: 'for' | 'against') => {
    // In a real application, this would call a smart contract function
    console.log(`Voted ${voteType} on proposal ${proposalId}`)
  }

  if (isLoading) {
    return (
      <div className={styles.governancePanel}>
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Loading governance proposals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.governancePanel}>
      <h2 className={styles.title}>
        Governance
        <Vote className={styles.icon} />
      </h2>
      <div className={styles.content}>
        <div className={styles.proposalList}>
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className={`${styles.proposalItem} ${styles[proposal.status]} ${selectedProposal?.id === proposal.id ? styles.selected : ''}`}
              onClick={() => setSelectedProposal(proposal)}
            >
              <h3>{proposal.title}</h3>
              <span className={styles.status}>{proposal.status}</span>
            </div>
          ))}
        </div>
        {selectedProposal && (
          <div className={styles.proposalDetails}>
            <h3>{selectedProposal.title}</h3>
            <p>{selectedProposal.description}</p>
            <div className={styles.voteStats}>
              <div className={styles.voteBar}>
                <div
                  className={styles.votesFor}
                  style={{ width: `${(selectedProposal.votesFor / (selectedProposal.votesFor + selectedProposal.votesAgainst)) * 100}%` }}
                />
              </div>
              <div className={styles.voteNumbers}>
                <span>For: {selectedProposal.votesFor.toLocaleString()}</span>
                <span>Against: {selectedProposal.votesAgainst.toLocaleString()}</span>
              </div>
            </div>
            {selectedProposal.status === 'active' && (
              <div className={styles.voteButtons}>
                <button onClick={() => handleVote(selectedProposal.id, 'for')}>
                  <CheckCircle className={styles.icon} />
                  Vote For
                </button>
                <button onClick={() => handleVote(selectedProposal.id, 'against')}>
                  <XCircle className={styles.icon} />
                  Vote Against
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

