
  var TranslationContract = artifacts.require("./TranslationContract.sol");
  
    contract('TranslationContract', function(accounts) {
      var joshs_address = accounts[0];
      var marys_address = accounts[1];
      var franks_address= accounts[2];
    //   var Languages = {English, Spanish, Chinese, French}
  
      it("should assert true", function() {
        var translation;
  
        return TranslationContract.deployed().then(function(instance){
          translation = instance;
  
          translation.requestTranslation("Test Translation", 1, 1, {from:joshs_address, value: 10});
          return translation.getStringToTranslate.call(joshs_address);
        }).then(function(result){
  
          console.log("Translation String = ",result);
          
        });
      });
    });
  