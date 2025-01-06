'use client'

import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { RefreshCw, AlertCircle } from 'lucide-react'
import styles from './LiveAPYTracker.module.scss'
import abi from '@/abi'

interface Farm {
  protocol: string
  allocation: number
  apy: number
  active: boolean
}

export default function LiveAPYTracker() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [bestFarm, setBestFarm] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const contractAddress = "0x42AC28dB42F5BE11B922f84893F3D4b960a28968" // Replace with your actual contract address
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const newContract = new ethers.Contract(contractAddress, abi, signer)
          setContract(newContract)
        } catch (err) {
          console.error("Failed to initialize contract:", err)
          setError("Failed to connect to the blockchain. Please make sure you have MetaMask installed and connected.")
        }
      } else {
        setError("Please install MetaMask to interact with this dApp.")
      }
    }

    initializeContract()
  }, [])

  const fetchFarms = useCallback(async () => {
    if (!contract) return

    setLoading(true)
    setError(null)
    try {
      const farmAddresses: string[] = []
      let i = 0
      while (true) {
        try {
          const farmAddress = await contract.activeFarms(i)
          farmAddresses.push(farmAddress)
          i++
        } catch (err) {
          break // We've reached the end of the activeFarms array
        }
      }

      if (farmAddresses.length === 0) {
        setFarms([])
        setBestFarm(null)
        setLoading(false)
        return
      }

      const farmData = await Promise.all(farmAddresses.map(address => contract.farms(address)))
      const formattedFarms = farmData.map(farm => ({
        protocol: farm.protocol,
        allocation: farm.allocation.toNumber() / 100, // Convert basis points to percentage
        apy: farm.apy.toNumber() / 100, // Assuming APY is stored with 2 decimal places
        active: farm.active
      }))

      setFarms(formattedFarms)

      try {
        const bestFarmAddress = await contract.getBestFarm()
        setBestFarm(bestFarmAddress)
      } catch (err) {
        console.error("Error getting best farm:", err)
        setBestFarm(null)
      }
    } catch (err) {
      console.error("Error fetching farms:", err)
      setError("Failed to fetch farm data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [contract])

  useEffect(() => {
    if (contract) {
      fetchFarms()
    }
  }, [contract, fetchFarms])

  const handleAllocationChange = async (protocol: string, newAllocation: number) => {
    if (!contract) return

    setLoading(true)
    try {
      const tx = await contract.updateAllocation(protocol, newAllocation * 100) // Convert percentage to basis points
      await tx.wait()
      await fetchFarms() // Refresh data after update
    } catch (err) {
      console.error("Error updating allocation:", err)
      setError("Failed to update allocation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAPYUpdate = async (protocol: string, newAPY: number) => {
    if (!contract) return

    setLoading(true)
    try {
      const tx = await contract.updateAPY(protocol, newAPY * 100) // Assuming we want to store APY with 2 decimal places
      await tx.wait()
      await fetchFarms() // Refresh data after update
    } catch (err) {
      console.error("Error updating APY:", err)
      setError("Failed to update APY. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddFarm = async () => {
    if (!contract) return

    const protocol = prompt("Enter the farm protocol address:")
    const allocation = prompt("Enter the initial allocation (0-100):")
    const apy = prompt("Enter the initial APY (%):")

    if (!protocol || !allocation || !apy) return

    setLoading(true)
    try {
      const tx = await contract.addFarm(protocol, parseInt(allocation) * 100, parseFloat(apy) * 100)
      await tx.wait()
      await fetchFarms() // Refresh data after adding farm
    } catch (err) {
      console.error("Error adding farm:", err)
      setError("Failed to add farm. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.liveAPYTracker}>
      <h2 className={styles.title}>
        Live APY Tracker
        <button onClick={fetchFarms} className={styles.refreshButton}>
          <RefreshCw size={24} />
        </button>
      </h2>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && farms.length === 0 && (
        <div className={styles.noFarms}>
          <AlertCircle size={48} />
          <p>No active farms found.</p>
          <button onClick={handleAddFarm} className={styles.addFarmButton}>
            Add Farm
          </button>
        </div>
      )}
      {farms.length > 0 && (
        <div className={styles.apyBoard}>
          {farms.map((farm) => (
            <div key={farm.protocol} className={`${styles.apyCard} ${farm.protocol === bestFarm ? styles.bestFarm : ''}`}>
              <span className={styles.protocol}>{farm.protocol}</span>
              <span className={styles.apy}>{farm.apy.toFixed(2)}% APY</span>
              <span className={styles.allocation}>Allocation: {farm.allocation}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={farm.allocation}
                onChange={(e) => handleAllocationChange(farm.protocol, parseInt(e.target.value))}
                className={styles.allocationSlider}
              />
              <div className={styles.actionButtons}>
                <button
                  className={styles.allocateButton}
                  onClick={() => handleAllocationChange(farm.protocol, farm.allocation)}
                >
                  Update Allocation
                </button>
                <button
                  className={styles.updateButton}
                  onClick={() => {
                    const newAPY = prompt("Enter new APY (%):")
                    if (newAPY !== null) {
                      handleAPYUpdate(farm.protocol, parseFloat(newAPY))
                    }
                  }}
                >
                  Update APY
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

