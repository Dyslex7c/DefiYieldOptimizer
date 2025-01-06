const abi = [
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"name": "OwnableInvalidOwner",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "account",
						"type": "address"
					}
				],
				"name": "OwnableUnauthorizedAccount",
				"type": "error"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "protocol",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "newAPY",
						"type": "uint256"
					}
				],
				"name": "APYUpdated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "protocol",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "allocation",
						"type": "uint256"
					}
				],
				"name": "FarmAdded",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "protocol",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "newAllocation",
						"type": "uint256"
					}
				],
				"name": "FarmUpdated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "previousOwner",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "OwnershipTransferred",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "activeFarms",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "protocol",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "allocation",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "apy",
						"type": "uint256"
					}
				],
				"name": "addFarm",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "farms",
				"outputs": [
					{
						"internalType": "address",
						"name": "protocol",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "allocation",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "apy",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getBestFarm",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "owner",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "renounceOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "transferOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "protocol",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "newAPY",
						"type": "uint256"
					}
				],
				"name": "updateAPY",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "protocol",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "newAllocation",
						"type": "uint256"
					}
				],
				"name": "updateAllocation",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		]
export default abi;