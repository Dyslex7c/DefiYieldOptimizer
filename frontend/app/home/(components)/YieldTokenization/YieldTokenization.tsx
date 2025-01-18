'use client'

import { useState, useEffect } from 'react'
import { Coins, Plus, Minus, AlertCircle } from 'lucide-react'
import { ethers } from 'ethers'
import styles from './YieldTokenization.module.scss'
import yieldTokenizationABI from './yieldTokenizationABI'
import yieldTokenABI from './yieldTokenABI'
import smartWalletAccountABI from './smartWalletAccountABI'

interface YieldToken {
  name: string
  symbol: string
  balance: number
  address: string
  type: 'yield' | 'principal'
}

const contractAddress = '0xA7d3EBe45dbE275756341841B8f30A0C4FBa1439'
const smartWalletAddress = '0xD501D21C683F91BC98c6e42f4F34De517Fb97bB2' // Replace with actual address

export default function YieldTokenization() {
  const [yieldTokens, setYieldTokens] = useState<YieldToken[]>([])
  const [selectedToken, setSelectedToken] = useState<YieldToken | null>(null)
  const [actionAmount, setActionAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isTransacting, setIsTransacting] = useState(false)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [smartWalletContract, setSmartWalletContract] = useState<ethers.Contract | null>(null)
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
          
          const smartWalletContract = new ethers.Contract(smartWalletAddress, smartWalletAccountABI, signer)
          setSmartWalletContract(smartWalletContract)
          
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
    const fetchTokens = async () => {
      if (contract && account) {
        try {
          setIsLoading(true)
          // Fetch Yield Token
          const yieldTokenAddress = await contract.getYieldTokenAddress()
          const yieldTokenContract = new ethers.Contract(yieldTokenAddress, yieldTokenABI, contract.provider)
          const yieldName = await yieldTokenContract.name()
          const yieldSymbol = await yieldTokenContract.symbol()
          const yieldBalance = await yieldTokenContract.balanceOf(account)

          // Fetch Principal Token
          const principalTokenAddress = await contract.getPrincipalTokenAddress()
          const principalTokenContract = new ethers.Contract(principalTokenAddress, yieldTokenABI, contract.provider)
          const principalName = await principalTokenContract.name()
          const principalSymbol = await principalTokenContract.symbol()
          const principalBalance = await principalTokenContract.balanceOf(account)

          setYieldTokens([
            {
              name: yieldName,
              symbol: yieldSymbol,
              balance: parseFloat(ethers.utils.formatEther(yieldBalance)),
              address: yieldTokenAddress,
              type: 'yield'
            },
            {
              name: principalName,
              symbol: principalSymbol,
              balance: parseFloat(ethers.utils.formatEther(principalBalance)),
              address: principalTokenAddress,
              type: 'principal'
            }
          ])
        } catch (error) {
          console.error('Failed to fetch tokens:', error)
          setError('Failed to fetch tokens. Please try again.')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchTokens()
  }, [contract, account])

  const handleAction = async (action: 'mint' | 'burn') => {
    if (!contract || !smartWalletContract || !selectedToken || !actionAmount || !account) return
    setError(null)
    setSuccessMessage(null)
    setIsTransacting(true)

    try {
      const amount = ethers.utils.parseEther(actionAmount)
      
      if (action === 'mint') {
        // Grant permission before minting
        await grantPermission(selectedToken.address, amount)

        if (selectedToken.type === 'yield') {
          await contract.mintYieldTokens(account, amount)
        } else {
          await contract.mintPrincipalTokens(account, amount)
        }
      } else {
        if (selectedToken.type === 'yield') {
          await contract.burnYieldTokens(account, amount)
        } else {
          await contract.burnPrincipalTokens(account, amount)
        }
      }

      setSuccessMessage(`Successfully ${action === 'mint' ? 'minted' : 'burned'} ${actionAmount} ${selectedToken.symbol}`)
      
      // Update balance
      const tokenContract = new ethers.Contract(selectedToken.address, yieldTokenABI, contract.provider)
      const newBalance = await tokenContract.balanceOf(account)
      setYieldTokens(prevTokens => prevTokens.map(token => 
        token.address === selectedToken.address 
          ? {...token, balance: parseFloat(ethers.utils.formatEther(newBalance))} 
          : token
      ))
      setSelectedToken(prevToken => 
        prevToken ? {...prevToken, balance: parseFloat(ethers.utils.formatEther(newBalance))} : null
      )
    } catch (error) {
      console.error(`Failed to ${action} tokens:`, error)
      setError(`Failed to ${action} tokens. Please try again.`)
    } finally {
      setIsTransacting(false)
    }
  }

  const grantPermission = async (tokenAddress: string, amount: ethers.BigNumber) => {
    if (!smartWalletContract || !account) return

    try {
      console.log("Granting permission for token:", tokenAddress)
      const tx = await smartWalletContract.grantPermission(
        "0xd00ae08403b9bbb9124bb305c09058e32c39a48c",
        account,
        amount,
        86400, // 1 day duration
        true,  // canMint
        true  // canBurn
      )
      console.log("Permission grant transaction sent:", tx.hash)
      await tx.wait()
      console.log("Permission granted successfully")
    } catch (error) {
      console.error('Failed to grant permission:', error)
      throw new Error(`Failed to grant permission: ${error.message}`)
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
