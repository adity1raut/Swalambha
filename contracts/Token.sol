//SPDX-License-Identifier:MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    constructor() ERC20("Voters Token", "VOTE") {}

    mapping(address _voter => uint256 electionId) public voterElectionId;

    function mintAuthorizedVoters(
        address _voter,
        uint256 currentElectionId
    ) external onlyOwner {
        require(balanceOf(_voter) == 0, "Already has a token");
        voterElectionId[_voter] = currentElectionId;
        _mint(_voter, 1);
    }

    function burnAfterVote(address _voter, uint256 currentElectionId) external {
        require(balanceOf(_voter) > 0);
        require(
            voterElectionId[_voter] == currentElectionId,
            "tokenId mismatch"
        );
        _burn(_voter, balanceOf(_voter));
    }
}
