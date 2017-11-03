var TranslationContract = artifacts.require("./TranslationContract.sol");
var TranslationUtils = artifacts.require("./TranslationUtils.sol");
var StringUtils = artifacts.require("./StringUtils.sol");
var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function(deployer) {
 
  deployer.deploy(SimpleStorage, { gas: 3000000 });
  deployer.deploy(TranslationUtils, { gas: 3000000 });
  deployer.deploy(StringUtils, { gas: 3000000 });
  deployer.link(StringUtils, TranslationContract);
  
  deployer.deploy(TranslationContract, { gas: 3000000 });
    
};
