// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;


import"@openzeppelin/contracts/access/Ownable.sol";

  contract ComeWithStake is  Ownable {
    uint256 public constant MINIMUM_STAKE = 0.0000001 ether;

    struct userInfo {
        string username ;
        string ipfsHash;
        uint256 stakedAmount;
        bool isActive;
      }

      mapping (address => userInfo) public users;

      event UserRegistered(address indexed user, string username, string ipfsHash, uint256 stakedAmount);
    event UserDeactivated(address indexed user);
    event StakeWithdrawn(address indexed user, uint256 amount);

      constructor( )  Ownable(msg.sender){}

      function stakeAmountAndRegister (string memory username , string memory ipfsHash) public payable {
        require(msg.value >= MINIMUM_STAKE , "Insufficient stake amount");
        require(!users[msg.sender].isActive,"User already registered");
        require(bytes(username).length > 0, "Username cannot be empty"); 
        require(bytes(ipfsHash).length > 0 , "IPFS hash cannot be empty");

        users[msg.sender] = userInfo({
            username : username,
            ipfsHash : ipfsHash,
            stakedAmount : msg.value,
            isActive : true
        });  
        emit UserRegistered(msg.sender, username, ipfsHash, msg.value);
      }

      function deactive() public {
        require(users[msg.sender].isActive, "User not active");
        users[msg.sender].isActive = false;
        emit UserDeactivated(msg.sender);
      }

      function withdrawEth ( ) public payable {
        require(users[msg.sender].isActive, "User not active");
        require(users[msg.sender].stakedAmount > 0,"No  stake to withdraw" );

        uint256 amount = users[msg.sender].stakedAmount;
        users[msg.sender].stakedAmount = 0;
        users[msg.sender].isActive = false;

        payable(msg.sender).transfer(amount);
        emit StakeWithdrawn(msg.sender, amount);
      }

      function checkWhetherIsRegistered (address _user) public view returns (string memory username, string memory ipfsHash, uint256 stakedAmount, bool isActive ) {
        userInfo memory user = users[_user];
        return (user.username, user.ipfsHash, user.stakedAmount, user.isActive);
      }
      receive() external payable { }

}