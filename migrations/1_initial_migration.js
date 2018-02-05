var Migrations = artifacts.require("./Migrations.sol");
var Token = artifacts.require("./SimpleToken.sol");
var Crowdsale = artifacts.require("./Crowdsale.sol");


module.exports = function(deployer) {
  deployer.deploy(Token);
};

