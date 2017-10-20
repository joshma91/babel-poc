pragma solidity ^0.4.15;

//import "github.com/Arachnid/solidity-stringutils/strings.sol";
import "./TranslationUtils.sol";
import "./StringUtils.sol";

contract TranslationContract {

    uint createdAt;
    address owner;
    uint count;


    enum Languages{English, Spanish, Chinese, French}

    //A structure to store everything to do with each translation request 
    struct TransObj {
        address originAddress;      //requestor address
        string originStr;           //string to be translated
        uint originLanguage;   
        uint destLanguage;
        uint price;                 //amount to be awarded to translator
        uint time;                  //timestamp of initial request
        bool completed;             //flag that the requestor can change or triggered after translation
        address transAddress;       //address of the translator
        string translatedStr;       //translated string

        //future variables: duration, reclaimed flag if expired 
    }

    //array to support multiple translation requests from single address
    mapping(address => TransObj[]) transMap;

    //Look up table for front end
    address[] public addressLUT;

    function TranslationContract() {
        createdAt = now;
        owner = msg.sender;
        count = 0;
    }

    event TranslationRequested(address addr, string str, uint value);
    event TranslationSuccess(address addr, string str, uint value);
    event TranslationFailed(address addr, string str, uint value);

    function requestTranslation(string str, uint lang1, uint lang2) payable {
        
        //get the array of translation objects for the requestor's address
        TransObj memory tmp;

        if (msg.value > 0){
            tmp.originAddress = msg.sender;
            tmp.originStr = str;
            tmp.originLanguage = lang1;
            tmp.destLanguage = lang2;
            tmp.price = msg.value;  //use the amount in txn
            tmp.time = now;
            tmp.completed = false;

            transMap[msg.sender].push(tmp);
            TranslationRequested(msg.sender, str, msg.value);
            
            //update LUT if it's the first transaction for the address
            if (transMap[msg.sender].length < 2) addressLUT.push(msg.sender);
        }
    }

    //function called to complete translation object + send reward to translator
    //'key' argument is the address of the requestor
    function performTranslation(string str, address key) {
        
        TransObj[] memory requestor = transMap[key];

        //check for the same string, completed == false, and value > 0
        for (uint i=0; i<requestor.length; i++){
            if (StringUtils.equal(requestor[i].originStr, str) && requestor[i].completed == false && requestor[i].price > 0 ){
                //update object with translation
                requestor[i].translatedStr = str;
                requestor[i].transAddress = msg.sender;

                //send the reward
                msg.sender.transfer(requestor[i].price);
                requestor[i].completed = true;
                 TranslationSuccess(msg.sender, str, requestor[i].price);
            } else {
                //send failure Event and cancel transaction
                TranslationFailed(msg.sender, str, requestor[i].price);
                revert();
            }
        }
    }

    function isRequestor (string str) returns (uint) {
        
        TransObj[] memory requestor = transMap[msg.sender];

        //check for the same string, completed == false
        for (uint i=0; i<requestor.length; i++){
            if (StringUtils.equal(requestor[i].originStr, str) && requestor[i].completed == false ){
                //if the person sending the txn is the original requestor, grant permission
                if (msg.sender == requestor[i].originAddress) {
                    return i;
                }
            }
        }
        
        //not the requestor
        revert();
    }

    function cancelTranslation(string str) {
        uint position = isRequestor(str);
        transMap[msg.sender][position].completed = true;
    }

    function getStringToTranslate(address adr) returns (bytes32[10]){
        //ideally this would be dynamic... but we'll figure a way to optimize
        bytes32[10] memory outputArray;
       
        TransObj[] memory requestor = transMap[adr];

        for(uint i=0; i<requestor.length; i++ ){
            bytes32 tmp = stringToBytes32(requestor[i].originStr);
            outputArray[i] = tmp;
        }

        return outputArray;
    }

    //this should be in Utils
    function stringToBytes32(string memory source) returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }

    //Solidity 0.4.17 apparently gives the ability to return custom objects externally - would like to play with this when it ships
    // function getOpenTranslations() returns (TransObj[]){
    // }
}