'use client'

import { useState, useEffect } from 'react'
import { ArrowRightLeft, Loader } from 'lucide-react'
import axios from 'axios'
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
      try {
        // Fetching chain data with icons from CoinGecko
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            ids: 'avalanche-2,ethereum,binancecoin', // IDs for Avalanche, Ethereum, Binance Coin
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        })

        const chainData = response.data.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          icon: coin.image, // URL to the coin's icon
        }))

        setChains(chainData)

        // Simulate assets data
        setAssets([
          { symbol: 'AVAX', name: 'Avalanche', balance: 100 },
          { symbol: 'ETH', name: 'Ethereum', balance: 5 },
          { symbol: 'USDC', name: 'USD Coin', balance: 1000 },
        ])
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data from CoinGecko', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTransfer = () => {
    if (!sourceChain || !targetChain || !selectedAsset || amount <= 0) return
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
                  <img src={chain.icon} alt={chain.name} className="h-6 w-6" />
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
                  <img src={chain.icon} alt={chain.name} className="h-6 w-6" />
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
