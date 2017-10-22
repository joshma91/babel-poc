pragma solidity ^0.4.15;

//import "github.com/Arachnid/solidity-stringutils/strings.sol";
import "./TranslationUtils.sol";
import "./StringUtils.sol";

contract TranslationContract {

    uint createdAt;
    address owner;
    Translation[] public translations;
    uint public numTranslations;

    //mapping to provide LUT of all translationIDs from particular address;    
    mapping (address => uint[]) public requestsByAddress; 

    enum Languages{English, Spanish, Chinese, French}

    //A structure to store everything to do with each translation request 
    struct Translation{
        
        address originAddress;      //requestor address
        string originStr;           //string to be translated
        uint originLanguage;   
        uint destLanguage;
        uint bounty;                //amount to be awarded to translator
        uint time;                  //timestamp of initial request
        bool completed;             //flag that the requestor can change or triggered after translation
        address transAddress;       //address of the translator
        string translatedStr;       //translated string

        //future variables: duration, reclaimed flag if expired 
    }

    function TranslationContract() {
        createdAt = now;
        owner = msg.sender;
        numTranslations = 0;
    }

    event TranslationRequested(uint translationID, address addr, string str, uint value);
    event TranslationSuccess(uint translationID, address addr, string str, uint value);
    event TranslationFailed(address addr, string str, uint value);

    function newTranslation(string str, uint lang1, uint lang2) payable returns (uint translationID) {
        
        //get the array of translation objects for the requestor's address

        if (msg.value > 0){

            translationID = translations.length;
            // Translation storage t = translations[translationID];
            Translation memory t; 
            
            t.originAddress = msg.sender;
            t.originStr = str;
            t.originLanguage = lang1;
            t.destLanguage = lang2;
            t.bounty = msg.value;  //use the amount in txn
            t.time = now;
            t.completed = false;

            translations.push(t);

            TranslationRequested(translationID, msg.sender, str, msg.value);
            //Add the translation ID to the mapping of address:translationID 
            requestsByAddress[msg.sender].push(translationID);
            numTranslations++;
        }
    }

    //function called to complete translation object + send reward to translator
    //'key' argument is the address of the requestor
    function performTranslation(string translatedText, uint translationID) {
        
        Translation storage t = translations[translationID];
        //update original Translation object with translation
        t.translatedStr = translatedText;
        t.transAddress = msg.sender;

        //send the reward
        //TODO: how to put into if/assert statement?
        msg.sender.transfer(t.bounty);
        TranslationSuccess(translationID, msg.sender, t.translatedStr, t.bounty);
        t.completed = true;
        // } else {
        //     TranslationFailed(translationID, msg.sender, t.translatedStr, t.bounty);
        //     revert();
        // }
    }

    modifier requestorOnly (uint translationID) {
        require(msg.sender == translations[translationID].originAddress);
        _;
    }

    function cancelTranslation(uint translationID, string str) requestorOnly (translationID) {
       
        //check to see if the string passed in is the same
        require(StringUtils.equal(str,translations[translationID].originStr));
        translations[translationID].completed = true;
    }

    function getAllOpenRequests() constant returns (bytes32[10]){
        bytes32[10] memory outputArray;
        for (uint i=0; i<translations.length; i++) {
            if (translations[i].completed == false) {
                bytes32 tmp = stringToBytes32(translations[i].originStr);
                outputArray[i] = tmp;
            }
        }

        return outputArray;
    }

    function getTranslatedString(uint translationID) constant returns (string){
        Translation t = translations[translationID];
        if(t.completed != true) return "ERROR: No translation found";
        return t.translatedStr;
    }

    //this should be in Utils
    function stringToBytes32(string memory source) returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }

    //Solidity 0.4.17 apparently gives the ability to return custom objects externally - would like to play with this when it ships
    // function getOpenTranslations() returns (Translation[]){
    // }
}