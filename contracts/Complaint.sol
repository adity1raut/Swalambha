// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Complaint {
    mapping(uint256 => string) public complaintCIDs;
    uint256[] public complaintTimestamps;

    event ComplaintAdded(uint256 indexed timestamp, string cid);

    function addComplaintCid(string memory cid) public {
        uint256 currentTime = block.timestamp;
        complaintCIDs[currentTime] = cid;
        complaintTimestamps.push(currentTime);
        emit ComplaintAdded(currentTime, cid);
    }

    function getComplaints() public view returns (string[] memory) {
        uint256 count = complaintTimestamps.length;
        string[] memory complaints = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            complaints[i] = complaintCIDs[complaintTimestamps[i]];
        }

        return complaints;
    }
}
