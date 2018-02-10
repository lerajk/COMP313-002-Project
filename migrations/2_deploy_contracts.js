var Token = artifacts.require("./SimpleToken.sol");
var Crowdsale = artifacts.require("./Crowdsale.sol");


module.exports = function(deployer) {

  var startTime = 1518377056;
  var endTime = 1518463456;
  var rate = 1; 
  var wallet = "0x3ccB4bd1a9923D47b84037548141715beFD3f9A4";
  //deployer.deploy(Token);

   deployer.deploy(Token)
  .then(function () {
    return deployer.deploy(Crowdsale, startTime, endTime, rate, wallet, Token.address)
  }).then(function() {
    console.log("Done deploying");
  }); 

};