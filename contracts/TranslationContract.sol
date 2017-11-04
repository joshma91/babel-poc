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
    struct Translation {
        
        uint translationID;
        address originAddress;      //requestor address
        bytes32 originHash;         //string to be translated - hash of string + id
        uint originLanguage;   
        uint destLanguage;
        uint bounty;                //amount to be awarded to translator
        uint time;                  //timestamp of initial request
        bool completed;             //flag that the requestor can change or triggered after translation
        address transAddress;       //address of the translator
        bytes32 translatedHash;     //translated string - hash of string + id

        string tmp; //to be deleted, only serves to enable test script

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

    function newTranslation(bytes32 str, uint lang1, uint lang2) public payable returns (uint translationID) {
        
        //get the array of translation objects for the requestor's address

        if (msg.value > 0) {

            translationID = translations.length;
            Translation memory t; 
            
            t.translationID = translationID;
            t.originAddress = msg.sender;
            t.originHash = str;
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
    function performTranslation(bytes32 strHash, uint translationID) public {
        
        Translation storage t = translations[translationID];
        //update original Translation object with translation
        t.translatedHash = strHash;
        t.transAddress = msg.sender;

        //send the reward
        //TODO: how to put into if/assert statement for failed event
        msg.sender.transfer(t.bounty);
        TranslationSuccess(translationID, msg.sender, t.translatedHash, t.bounty);
        t.completed = true;
    }

    modifier requestorOnly (uint translationID) {
        require(msg.sender == translations[translationID].originAddress);
        _;
    }

    function cancelTranslation(uint translationID) requestorOnly (translationID) public {
       
        translations[translationID].completed = true;
    }

    function getAllOpenRequests() constant returns (uint[10]) {
        uint[10] memory outputArray;
        uint nullCount = 0;
        for (uint i=0; i<translations.length; i++) {
            if (translations[i].completed == false) {
                uint tmp = translations[i].translationID;
                outputArray[i-nullCount] = tmp;
            } else {
                nullCount++;
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

    function getRequestIDsByAddress(address addr) constant returns (uint[]) {
        return requestsByAddress[addr]; 
    }


    function getTranslationByID(uint translationID) constant returns (bytes32) {
        return translations[translationID].translatedHash;
    }
        
    function getTranslatedHash(uint translationID) constant returns (bytes32) {
    
        Translation memory t = translations[translationID];
        if (t.completed != true || t.translatedHash == "") {
            return 0x00000000000000000000000000000000;
        }

        return t.translatedHash;
    }
    
    function getTmp(uint translationID) constant returns (string) {
        return translations[translationID].tmp;
    }
}