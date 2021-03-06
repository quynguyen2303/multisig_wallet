pragma solidity 0.6.0;
pragma experimental ABIEncoderV2;

/// @title Manage the multi signature wallet
/// @author phuquyng
/// @dev todo
contract Wallet {

    // list of approver addresses
    address[] public approvers;
    // minimal number of approvers need to approve a transfer
    uint public quorum;

    // create a struct to manage each Transfer
    struct Transfer {
        uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool sent;
    }
    Transfer[] public transfers;

    // define records who approves what
    mapping(address => mapping(uint => bool)) public approvals;

    // modifier to check owner from approvers list
    modifier onlyApprover () {
        bool isApprover = false;
        for (uint i = 0; i < approvers.length; i++) {
            if (msg.sender == approvers[i]) {
                isApprover = true;
            }
        }
        require(isApprover == true, "Only approver allowed.");
        _;
    }

    // contract constructor
    constructor(address[] memory _approvers, uint _quorum) public {
        approvers = _approvers;
        quorum = _quorum;
    }

    function getApprovers() external view returns(address[] memory) {
        return approvers;
    }

    function getTransfers() external view returns(Transfer[] memory) {
        return transfers;
    }

    // function to create a new transfer
    function createTransfer(uint amount, address payable to) external {
        transfers.push(Transfer(
            transfers.length,
            amount,
            to,
            0,
            false
        ));
    }

    // function to approve a transfer 
    function approveTransfer(uint _id) external {
        // check status of the transfer
        require(transfers[_id].sent == false, "Transfer has already been sent.");
        require(approvals[msg.sender][_id] == false, "Cannot approve transfer again.");

        approvals[msg.sender][_id] = true;
        transfers[_id].approvals++;

        if (transfers[_id].approvals >= quorum) {
            transfers[_id].sent = true;
            address payable to = transfers[_id].to;
            uint amount = transfers[_id].amount;
            to.transfer(amount);
        }
    }

    // function to receive ether 
    // todo: what the hell this function is doing?
    receive() external payable {}
}