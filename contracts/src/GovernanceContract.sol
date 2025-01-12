// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract Governance {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        ProposalStatus status;
    }

    enum ProposalStatus { Active, Passed, Rejected }

    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public nextProposalId;

    event ProposalCreated(uint256 id, string title, string description);
    event VoteCast(uint256 proposalId, address voter, bool inFavor);
    event ProposalFinalized(uint256 proposalId, ProposalStatus status);

    function createProposal(string memory _title, string memory _description) public {
        Proposal memory newProposal = Proposal({
            id: nextProposalId,
            title: _title,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            status: ProposalStatus.Active
        });
        proposals.push(newProposal);
        emit ProposalCreated(nextProposalId, _title, _description);
        nextProposalId++;
    }

    function vote(uint256 _proposalId, bool _inFavor) public {
        require(_proposalId < proposals.length, "Proposal does not exist");
        require(!hasVoted[_proposalId][msg.sender], "Already voted on this proposal");
        require(proposals[_proposalId].status == ProposalStatus.Active, "Proposal is not active");

        if (_inFavor) {
            proposals[_proposalId].votesFor++;
        } else {
            proposals[_proposalId].votesAgainst++;
        }
        hasVoted[_proposalId][msg.sender] = true;
        emit VoteCast(_proposalId, msg.sender, _inFavor);
    }

    function finalizeProposal(uint256 _proposalId) public {
        require(_proposalId < proposals.length, "Proposal does not exist");
        require(proposals[_proposalId].status == ProposalStatus.Active, "Proposal is already finalized");

        Proposal storage proposal = proposals[_proposalId];
        if (proposal.votesFor > proposal.votesAgainst) {
            proposal.status = ProposalStatus.Passed;
        } else {
            proposal.status = ProposalStatus.Rejected;
        }
        emit ProposalFinalized(_proposalId, proposal.status);
    }

    function getProposal(uint256 _proposalId) public view returns (Proposal memory) {
        require(_proposalId < proposals.length, "Proposal does not exist");
        return proposals[_proposalId];
    }
}
