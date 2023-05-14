// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";

contract Faucet is Owned {
    
    uint numOfFunders;
    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;

    modifier isGreater (uint amount) {
        require(amount <= 1000000000000000000, "Cannot withdraw more than 1eth");
        _;
    }

    function addFunds () external payable {
        address funder = msg.sender;

        if(!funders[funder]) {
            uint index = numOfFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
        
    }

    function getFunderAtIndex(uint _index) external view returns(address) {
        testing();
        return lutFunders[_index];
    }

    function getAllFunders() public view returns(address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for(uint i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function withdraw(uint amount) external isGreater(amount) {
            payable(msg.sender).transfer(amount);
    }

    function test() external isOwner {
        //do sth
    }
}


// let instance = await Faucet.deployed();
// instance.addFunds({from: accounts[0], value: "3000000"})
// instance.addFunds({from: accounts[3], value: "3000000"})
//0xbe9997050000000000000000000000000000000000000000000000000000000000000008
//0xbe999705
// instance.withdraw("900000000000000000", {from: accounts[0]})