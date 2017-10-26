pragma solidity ^0.4.15;

//import "github.com/Arachnid/solidity-stringutils/strings.sol";
import "./TranslationUtils.sol";
import "./StringUtils.sol";

contract TranslationContract {

    uint createdAt;
    address owner;
    Translation[] public translations;
    uint public numTranslations;
    string IPFSAddress;

    //mapping to provide LUT of all translationIDs from particular address;    
    mapping (address => uint[]) public requestsByAddress; 

    enum Languages{English, Spanish, Chinese, French}

    //A structure to store everything to do with each translation request 
    struct Translation {
        
        uint translationID;
        address originAddress;      //requestor address
        bytes32 originHash;           //string to be translated - hash of string + id
        uint originLanguage;   
        uint destLanguage;
        uint bounty;                //amount to be awarded to translator
        uint time;                  //timestamp of initial request
        bool completed;             //flag that the requestor can change or triggered after translation
        address transAddress;       //address of the translator
        bytes32 translatedHash;       //translated string - hash of string + id

        //future variables: duration, reclaimed flag if expired 
    }

    function TranslationContract() {
        createdAt = now;
        owner = msg.sender;
        numTranslations = 0;
    }

    event TranslationRequested(uint translationID, address addr, bytes32 str, uint value);
    event TranslationSuccess(uint translationID, address addr, bytes32 str, uint value);
    event TranslationFailed(address addr, bytes32 str, uint value);

    function newTranslation(bytes32 str, uint lang1, uint lang2) payable returns (uint translationID) {
        
        //get the array of translation objects for the requestor's address

        if (msg.value > 0) {

            translationID = translations.length;
            Translation memory t; 
            bytes32 origin = str;
            
            t.translationID = translationID;
            t.originAddress = msg.sender;
            t.originHash = origin;
            t.originLanguage = lang1;
            t.destLanguage = lang2;
            t.bounty = msg.value;  //use the amount in txn
            t.time = now;
            t.completed = false;

            translations.push(t);

            TranslationRequested(translationID, msg.sender, origin, msg.value);
            //Add the translation ID to the mapping of address:translationID 
            requestsByAddress[msg.sender].push(translationID);
            numTranslations++;
        }
    }

    //function called to complete translation object + send reward to translator
    //'key' argument is the address of the requestor
    function performTranslation(bytes32 str, uint translationID) {
        
        Translation storage t = translations[translationID];
        //update original Translation object with translation
        t.translatedHash = str;
        t.transAddress = msg.sender;

        //send the reward
        //TODO: how to put into if/assert statement?
        msg.sender.transfer(t.bounty);
        TranslationSuccess(translationID, msg.sender, t.translatedHash, t.bounty);
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
       
        translations[translationID].completed = true;
    }

    function getAllOpenRequests() constant returns (uint[10]) {
        uint[10] memory outputArray;
        for (uint i=0; i<translations.length; i++) {
            if (translations[i].completed == false) {
                uint tmp = translations[i].translationID;
                outputArray[i] = tmp;
                // bytes32 tmp = stringToBytes32(translations[i].originStr);
            }
        }

        return outputArray;
    }

    function getRequestHash(uint translationID) constant returns (bytes32) {
        return translations[translationID].originHash;
    }

    function getFromLanguage(uint translationID) constant returns (uint) {
        return translations[translationID].originLanguage;
    }

    function getToLanguage(uint translationID) constant returns (uint) {
        return translations[translationID].destLanguage;
    }

    function getTranslatedHash(uint translationID) constant returns (bytes32) {
        Translation memory t = translations[translationID];
        if (t.completed != true) {
            return "ERROR: No translation found";
        }
        return t.translatedHash;
    }

    //this should be in Utils
    function stringToBytes32(string memory source) returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }

    function storeIPFSAddress(string ipfsadrs){
        IPFSAddress = ipfsadrs;
    }

    function getIPFSAddress() constant returns (string){
        return IPFSAddress;
    }

    //Solidity 0.4.17 apparently gives the ability to return custom objects externally - would like to play with this when it ships
    // function getOpenTranslations() returns (Translation[]){
    // }
}