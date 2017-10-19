var BiddingContract = artifacts.require("./BiddingContract.sol");
var HelloWorld = artifacts.require("./HelloWorld.sol");
var TranslationContract = artifacts.require("./TranslationContract.sol");
var TranslationUtils = artifacts.require("./TranslationUtils.sol");
var StringUtils = artifacts.require("./StringUtils.sol");

module.exports = function(deployer) {
  deployer.deploy(BiddingContract, "Josh", "Josh's auction", 100, 1);
  deployer.deploy(HelloWorld);
  deployer.deploy(TranslationUtils);
  deployer.deploy(StringUtils);
  deployer.link(StringUtils, TranslationContract);
  
  deployer.deploy(TranslationContract);
    
};
