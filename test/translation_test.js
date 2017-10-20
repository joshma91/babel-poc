
  var TranslationContract = artifacts.require("./TranslationContract.sol");
  
    contract('TranslationContract', function(accounts) {
      var joshs_address = accounts[0];
      var marys_address = accounts[1];
      var franks_address= accounts[2];
      var Languages = {English:1, Spanish:2, Chinese:3, French:4}

      var toAscii = function(hex) {
        // Find termination
            var str = "";
            var i = 0, l = hex.length;
            if (hex.substring(0, 2) === '0x') {
                i = 2;
            }
            for (; i < l; i+=2) {
                var code = parseInt(hex.substr(i, 2), 16);
                str += String.fromCharCode(code);
            }
        
            return str;
        };
  
      it("should assert true", function() {
        var translation;
  
        return TranslationContract.deployed().then(function(instance){
          translation = instance;
  
          translation.requestTranslation("Test Translation", Languages.English, Languages.French, {from:joshs_address, value: 10});
          return translation.getStringToTranslate.call(joshs_address);
        }).then(function(result){

          const str = toAscii(result[0]).replace(/\0/g, '');
  
          console.log("Translation Stringgggg = ",str);
          assert.equal(str, "Test Translation");
                  
        });
      });
    });
  