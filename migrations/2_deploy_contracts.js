var TranslationContract = artifacts.require("./TranslationContract.sol");
var TranslationUtils = artifacts.require("./TranslationUtils.sol");
var StringUtils = artifacts.require("./StringUtils.sol");

module.exports = function(deployer) {
 
  deployer.deploy(TranslationUtils);
  deployer.deploy(StringUtils);
  deployer.link(StringUtils, TranslationContract);
  
  deployer.deploy(TranslationContract);
    
};
