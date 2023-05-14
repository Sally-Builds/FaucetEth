// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract Owned {

    address owner;
    constructor () {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == owner, "You do not have the permission to perform this action.") ;
        _;
    }

    function testing() public pure returns (uint) {
        return 8;
    }
}