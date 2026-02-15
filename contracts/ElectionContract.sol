// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVoterToken {
    function mintAuthorizedVoters(
        address _voter,
        uint256 currentElectionId
    ) external;

    function burnAfterVote(address _voter, uint256 currentElectionId) external;

    function balanceOf(address account) external view returns (uint256);
}

contract ElectionContract {
    error Election__InvalidRegistrationDate();
    error Election__InvalidElectionDate();
    error Election__VotingNotActive();
    error Election__CandidateAlreadyExists();
    error Election__ElectionNotFound();
    error Election__ElectionNotEnded();
    error Election__NoCandidates();

    struct Election {
        uint256 electionId;
        string position;
        uint256 candidateRegStartDate;
        uint256 candidateRegEndDate;
        uint256 electionStartDate;
        uint256 electionEndDate;
        address token;
        string winner; // Usually updated after the election ends
        string[] candidateIds; // Store candidate names/IDs here instead of mapping
    }

    uint256 private s_electionIdCounter = 0;
    mapping(uint256 => Election) public electionInfo;

    // To track votes: mapping(electionId => mapping(candidateId => voteCount))
    mapping(uint256 => mapping(string => uint256)) public candidateVotes;
    mapping(uint256 => mapping(string => bool)) public candidateExists;

    function createElection(
        string memory _position,
        uint256 _regStart,
        uint256 _regEnd,
        uint256 _electionStart,
        uint256 _electionEnd,
        address _token
    ) external {
        // 1. Validation Logic
        if (_regStart >= _regEnd) revert Election__InvalidRegistrationDate();
        if (_electionStart >= _electionEnd)
            revert Election__InvalidElectionDate();
        if (_regEnd > _electionStart) revert Election__InvalidElectionDate(); // Reg must end before voting starts

        // 2. Increment Counter
        uint256 currentId = s_electionIdCounter;

        // 3. Storage Assignment
        // We initialize the struct in storage directly
        Election storage newElection = electionInfo[currentId];

        newElection.electionId = currentId;
        newElection.position = _position;
        newElection.candidateRegStartDate = _regStart;
        newElection.candidateRegEndDate = _regEnd;
        newElection.electionStartDate = _electionStart;
        newElection.electionEndDate = _electionEnd;
        newElection.token = _token;

        // 4. Update the global counter for the next election
        s_electionIdCounter++;
    }

    event VoteCast(
        uint256 indexed electionId,
        address indexed voter,
        string candidateId
    );

    function vote(uint256 _electionId, string memory _candidateId) public {
        Election storage election = electionInfo[_electionId];

        // Check election exists
        require(election.electionEndDate != 0, "Election does not exist");

        // Check voting is active
        require(
            block.timestamp >= election.electionStartDate &&
                block.timestamp <= election.electionEndDate,
            "Voting not active"
        );

        // Check candidate exists
        require(
            candidateExists[_electionId][_candidateId],
            "Candidate not registered"
        );

        // Check voter has tokens
        IVoterToken token = IVoterToken(election.token);
        uint256 userBalance = token.balanceOf(msg.sender);
        require(userBalance > 0, "No voting tokens");

        // Burn token
        token.burnAfterVote(msg.sender, _electionId);

        // Increment vote
        candidateVotes[_electionId][_candidateId] += 1;

        // Emit event for tracking
        emit VoteCast(_electionId, msg.sender, _candidateId);
    }

    // Add this event at the top of your contract

    function addCandidate(uint256 _electionId, string memory email) public {
        Election storage election = electionInfo[_electionId];

        if (election.electionEndDate == 0) {
            revert Election__ElectionNotFound();
        }

        if (candidateExists[_electionId][email]) {
            revert Election__CandidateAlreadyExists();
        }

        election.candidateIds.push(email);
        candidateExists[_electionId][email] = true;
    }

    function endElection(uint256 _electionId) public {
        Election storage election = electionInfo[_electionId];

        if (election.electionEndDate == 0) {
            revert Election__ElectionNotFound();
        }

        if (block.timestamp <= election.electionEndDate) {
            revert Election__ElectionNotEnded();
        }

        uint256 candidateCount = election.candidateIds.length;
        if (candidateCount == 0) {
            revert Election__NoCandidates();
        }

        uint256 highestVotes = 0;
        string memory winner;

        for (uint256 i = 0; i < candidateCount; i++) {
            string memory candidateId = election.candidateIds[i];
            uint256 votes = candidateVotes[_electionId][candidateId];

            if (votes > highestVotes) {
                highestVotes = votes;
                winner = candidateId;
            }
        }

        election.winner = winner;
    }

    function getElection(
        uint256 _electionId
    )
        public
        view
        returns (
            uint256 electionId,
            string memory position,
            uint256 regStart,
            uint256 regEnd,
            uint256 electionStart,
            uint256 electionEnd,
            address token,
            string memory winnerIndex
        )
    {
        Election storage e = electionInfo[_electionId];

        return (
            e.electionId,
            e.position,
            e.candidateRegStartDate,
            e.candidateRegEndDate,
            e.electionStartDate,
            e.electionEndDate,
            e.token,
            e.winner
        );
    }

    function getCandidates(
        uint256 _electionId
    ) public view returns (string[] memory) {
        return electionInfo[_electionId].candidateIds;
    }

    function getCandidateVotes(
        uint256 _electionId,
        string memory _candidateId
    ) public view returns (uint256) {
        return candidateVotes[_electionId][_candidateId];
    }

    function getWinner(
        uint256 _electionId
    ) public view returns (string memory) {
        Election storage election = electionInfo[_electionId];

        if (election.candidateIds.length == 0) {
            revert Election__NoCandidates();
        }

        return election.winner;
    }

    function getelectionIdCounter() public view returns (uint256) {
        return s_electionIdCounter;
    }
}
