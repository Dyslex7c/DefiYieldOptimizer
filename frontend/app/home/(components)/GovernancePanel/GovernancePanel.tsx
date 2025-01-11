'use client'

import { useState, useEffect } from 'react'
import { Vote, CheckCircle, XCircle, Plus } from 'lucide-react'
import { ethers } from 'ethers'
import abi from './governanceABI'
import styles from './GovernancePanel.module.scss'

interface Proposal {
  id: number
  title: string
  description: string
  votesFor: number
  votesAgainst: number
  status: 'Active' | 'Passed' | 'Rejected'
}

const contractAddress = '0x84D8779e6f128879F99Ea26a2829318867c87721'

export default function GovernancePanel() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [isCreatingProposal, setIsCreatingProposal] = useState(false)
  const [newProposal, setNewProposal] = useState({ title: '', description: '' })

  useEffect(() => {
    const initializeEthers = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const governanceContract = new ethers.Contract(contractAddress, abi, signer)
          setContract(governanceContract)
          const address = await signer.getAddress()
          setAccount(address)
        } catch (error) {
          console.error('Failed to connect to Ethereum:', error)
        }
      } else {
        console.error('Ethereum provider not found')
      }
    }

    initializeEthers()
  }, [])

  useEffect(() => {
    const fetchProposals = async () => {
      if (contract) {
        try {
          setIsLoading(true)
          const nextProposalId = await contract.nextProposalId()
          const fetchedProposals = []
          for (let i = 0; i < nextProposalId; i++) {
            const proposal = await contract.getProposal(i)
            fetchedProposals.push({
              id: proposal.id.toNumber(),
              title: proposal.title,
              description: proposal.description,
              votesFor: proposal.votesFor.toNumber(),
              votesAgainst: proposal.votesAgainst.toNumber(),
              status: ['Active', 'Passed', 'Rejected'][proposal.status] as 'Active' | 'Passed' | 'Rejected'
            })
          }
          setProposals(fetchedProposals)
        } catch (error) {
          console.error('Failed to fetch proposals:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchProposals()
  }, [contract])

  const handleVote = async (proposalId: number, inFavor: boolean) => {
    if (contract && account) {
      try {
        const tx = await contract.vote(proposalId, inFavor)
        await tx.wait()
        // Refresh proposals after voting
        const updatedProposal = await contract.getProposal(proposalId)
        setProposals(prevProposals =>
          prevProposals.map(p =>
            p.id === proposalId
              ? {
                  ...p,
                  votesFor: updatedProposal.votesFor.toNumber(),
                  votesAgainst: updatedProposal.votesAgainst.toNumber()
                }
              : p
          )
        )
      } catch (error) {
        console.error('Failed to vote:', error)
      }
    }
  }

  const handleCreateProposal = async () => {
    if (contract && account) {
      try {
        const tx = await contract.createProposal(newProposal.title, newProposal.description)
        await tx.wait()
        setIsCreatingProposal(false)
        setNewProposal({ title: '', description: '' })
        // Refresh proposals after creating a new one
        const nextProposalId = await contract.nextProposalId()
        const newProposalData = await contract.getProposal(nextProposalId.sub(1))
        setProposals(prevProposals => [
          ...prevProposals,
          {
            id: newProposalData.id.toNumber(),
            title: newProposalData.title,
            description: newProposalData.description,
            votesFor: newProposalData.votesFor.toNumber(),
            votesAgainst: newProposalData.votesAgainst.toNumber(),
            status: ['Active', 'Passed', 'Rejected'][newProposalData.status] as 'Active' | 'Passed' | 'Rejected'
          }
        ])
      } catch (error) {
        console.error('Failed to create proposal:', error)
      }
    }
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
              className={`${styles.proposalItem} ${styles[proposal.status.toLowerCase()]} ${selectedProposal?.id === proposal.id ? styles.selected : ''}`}
              onClick={() => setSelectedProposal(proposal)}
            >
              <h3>{proposal.title}</h3>
              <span className={styles.status}>{proposal.status}</span>
            </div>
          ))}
          <button className={styles.createProposalButton} onClick={() => setIsCreatingProposal(true)}>
            <Plus className={styles.icon} />
            Create Proposal
          </button>
        </div>
        {selectedProposal && (
          <div className={styles.proposalDetails}>
            <h3>{selectedProposal.title}</h3>
            <p>{selectedProposal.description}</p>
            <div className={styles.voteStats}>
              <div className={styles.voteBar}>
                <div
                  className={styles.votesFor}
                  style={{ width: `${(selectedProposal.votesFor / (selectedProposal.votesFor + selectedProposal.votesAgainst || 1)) * 100}%` }}
                />
              </div>
              <div className={styles.voteNumbers}>
                <span>For: {selectedProposal.votesFor.toLocaleString()}</span>
                <span>Against: {selectedProposal.votesAgainst.toLocaleString()}</span>
              </div>
            </div>
            {selectedProposal.status === 'Active' && (
              <div className={styles.voteButtons}>
                <button onClick={() => handleVote(selectedProposal.id, true)}>
                  <CheckCircle className={styles.icon} />
                  Vote For
                </button>
                <button onClick={() => handleVote(selectedProposal.id, false)}>
                  <XCircle className={styles.icon} />
                  Vote Against
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {isCreatingProposal && (
        <div className={styles.createProposalModal}>
          <div className={styles.modalContent}>
            <h3>Create New Proposal</h3>
            <input
              type="text"
              placeholder="Proposal Title"
              value={newProposal.title}
              onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
            />
            <textarea
              placeholder="Proposal Description"
              value={newProposal.description}
              onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
            />
            <div className={styles.modalButtons}>
              <button onClick={handleCreateProposal}>Create</button>
              <button onClick={() => setIsCreatingProposal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}