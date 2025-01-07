const abi = [
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "description",
						"type": "string"
					}
				],
				"name": "ProposalCreated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "proposalId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "enum Governance.ProposalStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"name": "ProposalFinalized",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "proposalId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "voter",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "bool",
						"name": "inFavor",
						"type": "bool"
					}
				],
				"name": "VoteCast",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "_description",
						"type": "string"
					}
				],
				"name": "createProposal",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_proposalId",
						"type": "uint256"
					}
				],
				"name": "finalizeProposal",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_proposalId",
						"type": "uint256"
					}
				],
				"name": "getProposal",
				"outputs": [
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "id",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "title",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "description",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "votesFor",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "votesAgainst",
								"type": "uint256"
							},
							{
								"internalType": "enum Governance.ProposalStatus",
								"name": "status",
								"type": "uint8"
							}
						],
						"internalType": "struct Governance.Proposal",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "hasVoted",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "nextProposalId",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "proposals",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "votesFor",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "votesAgainst",
						"type": "uint256"
					},
					{
						"internalType": "enum Governance.ProposalStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_proposalId",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "_inFavor",
						"type": "bool"
					}
				],
				"name": "vote",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		]
export default abi;