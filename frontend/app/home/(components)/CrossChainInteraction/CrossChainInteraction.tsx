'use client'

import { useState, useEffect } from 'react'
import { ArrowRightLeft, Loader } from 'lucide-react'
import styles from './CrossChainInteraction.module.scss'

interface Chain {
  id: string
  name: string
  icon: string
}

interface Asset {
  symbol: string
  name: string
  balance: number
}

export default function CrossChainInteraction() {
  const [sourceChain, setSourceChain] = useState<Chain | null>(null)
  const [targetChain, setTargetChain] = useState<Chain | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  const [chains, setChains] = useState<Chain[]>([])
  const [assets, setAssets] = useState<Asset[]>([])

  useEffect(() => {
    const fetchData = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setChains([
        { id: 'avalanche', name: 'Avalanche', icon: '🔺' },
        { id: 'ethereum', name: 'Ethereum', icon: '💎' },
        { id: 'binance', name: 'Binance Smart Chain', icon: '🟨' },
      ])
      setAssets([
        { symbol: 'AVAX', name: 'Avalanche', balance: 100 },
        { symbol: 'ETH', name: 'Ethereum', balance: 5 },
        { symbol: 'USDC', name: 'USD Coin', balance: 1000 },
      ])
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const handleTransfer = () => {
    if (!sourceChain || !targetChain || !selectedAsset || amount <= 0) return
    // In a real application, this would call a cross-chain bridge contract
    console.log(`Transferring ${amount} ${selectedAsset.symbol} from ${sourceChain.name} to ${targetChain.name}`)
  }

  if (isLoading) {
    return (
      <div className={styles.crossChainInteraction}>
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Loading cross-chain data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.crossChainInteraction}>
      <h2 className={styles.title}>
        Cross-Chain Interaction
        <ArrowRightLeft className={styles.icon} />
      </h2>
      <div className={styles.content}>
        <div className={styles.chainSelector}>
          <div>
            <h3>Source Chain</h3>
            <div className={styles.chainList}>
              {chains.map((chain) => (
                <div
                  key={chain.id}
                  className={`${styles.chainItem} ${sourceChain?.id === chain.id ? styles.selected : ''}`}
                  onClick={() => setSourceChain(chain)}
                >
                  <span className={styles.icon}>{chain.icon}</span>
                  <span>{chain.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3>Target Chain</h3>
            <div className={styles.chainList}>
              {chains.map((chain) => (
                <div
                  key={chain.id}
                  className={`${styles.chainItem} ${targetChain?.id === chain.id ? styles.selected : ''}`}
                  onClick={() => setTargetChain(chain)}
                >
                  <span className={styles.icon}>{chain.icon}</span>
                  <span>{chain.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.assetSelector}>
          <h3>Select Asset</h3>
          <div className={styles.assetList}>
            {assets.map((asset) => (
              <div
                key={asset.symbol}
                className={`${styles.assetItem} ${selectedAsset?.symbol === asset.symbol ? styles.selected : ''}`}
                onClick={() => setSelectedAsset(asset)}
              >
                <span>{asset.symbol}</span>
                <span>Balance: {asset.balance}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.transferPanel}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter amount to transfer"
            className={styles.amountInput}
          />
          <button onClick={handleTransfer} className={styles.transferButton}>
            <Loader className={styles.icon} />
            Transfer
          </button>
        </div>
      </div>
    </div>
  )
}

