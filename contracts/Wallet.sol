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
}