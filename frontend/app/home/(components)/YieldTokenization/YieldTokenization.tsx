'use client'

import { useState, useEffect } from 'react'
import { Coins, ArrowRight, RefreshCw, Plus, Minus, AlertCircle } from 'lucide-react'
import { ethers } from 'ethers'
import yieldTokenizationABI from './yieldTokenizationABI'
import yieldTokenABI from './yieldTokenABI'
import styles from './YieldTokenization.module.scss'

interface YieldToken {
  name: string
  symbol: string
  balance: number
  address: string
}

const contractAddress = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8'

export default function YieldTokenization() {
  const [yieldTokens, setYieldTokens] = useState<YieldToken[]>([])
  const [selectedToken, setSelectedToken] = useState<YieldToken | null>(null)
  const [actionAmount, setActionAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isTransacting, setIsTransacting] = useState(false)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')

  useEffect(() => {
    const initializeEthers = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          setConnectionStatus('connecting')
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const yieldTokenizationContract = new ethers.Contract(contractAddress, yieldTokenizationABI, signer)
          setContract(yieldTokenizationContract)
          const address = await signer.getAddress()
          setAccount(address)
          setConnectionStatus('connected')
        } catch (error) {
          console.error('Failed to connect to Ethereum:', error)
          setError('Failed to connect to Ethereum. Please make sure you have MetaMask installed and connected.')
          setConnectionStatus('disconnected')
        }
      } else {
        setError('Ethereum provider not found. Please install MetaMask.')
        setConnectionStatus('disconnected')
      }
    }

    initializeEthers()
  }, [])

  useEffect(() => {
    const fetchYieldTokens = async (contract: ethers.Contract | null) => {
      if (contract && account) {
        try {
          setIsLoading(true)
          console.log(contract);
          
          const yieldTokenAddress = await contract.yieldToken()
          console.log(yieldTokenAddress);
          const yieldTokenContract = new ethers.Contract(yieldTokenAddress, yieldTokenABI, contract.provider)
          const name = await yieldTokenContract.name()
          const symbol = await yieldTokenContract.symbol()
          const balance = await yieldTokenContract.balanceOf(account)
          
          setYieldTokens([
            {
              name,
              symbol,
              balance: parseFloat(ethers.utils.formatEther(balance)),
              address: yieldTokenAddress
            }
          ])
          setSelectedToken({
            name,
            symbol,
            balance: parseFloat(ethers.utils.formatEther(balance)),
            address: yieldTokenAddress
          })
        } catch (error) {
          console.error('Failed to fetch yield tokens:', error)
          setError('Failed to fetch yield tokens. Please try again.')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchYieldTokens(contract)
  }, [contract, account])

  const handleAction = async (action: 'mint' | 'burn') => {
    if (!contract || !selectedToken || !actionAmount) return
    setError(null)
    setSuccessMessage(null)
    setIsTransacting(true)

    try {
      const amount = ethers.utils.parseEther(actionAmount)
      let tx
      if (action === 'mint') {
        tx = await contract.requestMint(amount)
      } else {
        tx = await contract.requestBurn(amount)
      }
      setSuccessMessage(`Transaction submitted. Waiting for confirmation...`)
      await tx.wait()
      setSuccessMessage(`Successfully ${action === 'mint' ? 'minted' : 'burned'} ${actionAmount} ${selectedToken.symbol}`)
      
      // Update balance
      const yieldTokenContract = new ethers.Contract(selectedToken.address, yieldTokenABI, contract.provider)
      const newBalance = await yieldTokenContract.balanceOf(account)
      setYieldTokens(prevTokens => prevTokens.map(token => 
        token.address === selectedToken.address 
          ? {...token, balance: parseFloat(ethers.utils.formatEther(newBalance))} 
          : token
      ))
      setSelectedToken(prevToken => 
        prevToken ? {...prevToken, balance: parseFloat(ethers.utils.formatEther(newBalance))} : null
      )
    } catch (error: any) {
      console.error(`Failed to ${action} tokens:`, error)
      if (error.code === 'ACTION_REJECTED') {
        setError('Transaction rejected by user.')
      } else if (error.message.includes('InvalidAmount')) {
        setError('Invalid amount. Please enter a non-zero amount.')
      } else if (error.message.includes('InsufficientBalance')) {
        setError('Insufficient balance for this operation.')
      } else if (error.message.includes('MintFailed') || error.message.includes('BurnFailed')) {
        setError(`Failed to ${action} tokens. Please try again.`)
      } else {
        setError(`An unexpected error occurred. Please try again.`)
      }
    } finally {
      setIsTransacting(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.yieldTokenization}>
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Loading yield tokens...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.yieldTokenization}>
      <h2 className={styles.title}>
        Yield Tokenization
        <Coins className={styles.icon} />
      </h2>
      <div className={`${styles.connectionStatus} ${styles[connectionStatus]}`}>
        {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
      </div>
      {error && (
        <div className={styles.error}>
          <AlertCircle className={styles.icon} />
          {error}
        </div>
      )}
      {successMessage && <div className={styles.success}>{successMessage}</div>}
      <div className={styles.content}>
        <div className={styles.tokenList}>
          {yieldTokens.map((token) => (
            <div
              key={token.address}
              className={`${styles.tokenItem} ${selectedToken?.address === token.address ? styles.selected : ''}`}
              onClick={() => setSelectedToken(token)}
            >
              <h3>{token.name}</h3>
              <p>Symbol: {token.symbol}</p>
              <p>Balance: {token.balance.toFixed(4)}</p>
            </div>
          ))}
        </div>
        {selectedToken && (
          <div className={styles.actionPanel}>
            <h3>Actions for {selectedToken.symbol}</h3>
            <input
              type="number"
              value={actionAmount}
              onChange={(e) => setActionAmount(e.target.value)}
              placeholder="Enter amount"
              className={styles.amountInput}
              disabled={isTransacting}
            />
            <div className={styles.actionButtons}>
              <button onClick={() => handleAction('mint')} disabled={isTransacting}>
                <Plus className={styles.icon} />
                Mint
              </button>
              <button onClick={() => handleAction('burn')} disabled={isTransacting}>
                <Minus className={styles.icon} />
                Burn
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

