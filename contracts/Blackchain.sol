
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Blackchain {
    address public owner;
    mapping(address => bool) public activated;

    event Activated(address indexed user);

    constructor() {
        owner = msg.sender;
    }

    function activate() public {
        activated[msg.sender] = true;
        emit Activated(msg.sender);
    }

    function isActive(address user) public view returns (bool) {
        return activated[user];
    }
}
