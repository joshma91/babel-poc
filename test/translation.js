var toAscii = require("./utils");
var ipfsAPI = require('ipfs-api');
var bs58 = require('bs58')

const TranslationContract = artifacts.require("./TranslationContract.sol");

/* Configuration variables */
const ipfsHost    = 'localhost';
const ipfsAPIPort = '5001';
const ipfsWebPort = '8080';
const ipfsAddress = "http://" + ipfsHost + ':' + ipfsWebPort + "/ipfs";

var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

// /* IPFS initialization */
ipfs.swarm.peers(function (err, res) {
    if (err) {
        console.error(err);
    } else {
      var numPeers = res === null ? 0 : res.length;
      console.log("IPFS - connected to " + numPeers + " peers");
    }
});

//following 2 functions needed to store/retrieve IPFS hash to/from bytes32
function ipfsHashToBytes32(ipfs_hash) {
  var h = bs58.decode(ipfs_hash).toString('hex').replace(/^1220/, '');
  if (h.length != 64) {
      console.log('invalid ipfs format', ipfs_hash, h);
      return null;
  }
  return '0x' + h;
}

function bytes32ToIPFSHash(hash_hex) {

  var buf = new Buffer(hash_hex.replace(/^0x/, '1220'), 'hex')
  return bs58.encode(buf)
}

const fetchRequestString = (translationID) => {


}


contract("TranslationContract", accounts => {
  const [joshs_address, marys_address, franks_address] = accounts;
  const Languages = { English: 1, Spanish: 2, Chinese: 3, French: 4 };

  it("should return the string to be translated", async () => {
    const translationInstance = await TranslationContract.deployed();
    
    const newTranslation = async (obj) => {
      ipfs.add(new Buffer(obj.string), (err, result) => {
          if (err) {
              console.error("Content submission error:", err);
              return false;
          } else if (result && result[0] && result[0].hash) {
              console.log("Content successfully stored. IPFS address:", result[0].hash);
              //make contract calls to store the IPFS hash in Bytes32
              translationInstance.newTranslation(
                ipfsHashToBytes32(result[0].hash),
                obj.from,
                obj.to,
                obj.data
              );

          } else {
              console.log(result);
              console.error("Unresolved content submission error");
              return null;
          }
      });
    }

    const firstRequest =  {
      string: "Test Translation", 
      from: Languages.English, 
      to: Languages.French, 
      data: {from: joshs_address, value: 10 }};

    await newTranslation(firstRequest);
     
    const secondRequest = {
      string: "Hi, how are you?",
      from: Languages.English,
      to: Languages.French,
      data: {from: joshs_address, value: 10 }};

    await newTranslation(secondRequest);
      
    const thirdRequest = {
      string: "Hi, how are you?",
      from: Languages.English,
      to: Languages.French,
      data: {from: joshs_address, value: 10 }};
    
    await newTranslation(thirdRequest);

    const arrayOfIds = await translationInstance.getAllOpenRequests.call();
    const requestHash = await translationInstance.getRequestHash(arrayOfIds[2]);

    console.log("trying to get my string back. Hash is: " + requestHash)
   
    //convert to form consumable by IPFS
    const bytes32toIPFS = bytes32ToIPFSHash(requestHash);

    //grab the stupid string from IPFS
   await ipfs.cat(bytes32toIPFS, {buffer:true}).then(function(res){
      console.log("hello there! " + res);
      assert.equal(res.toString(), "Hi, how are you?");
      
    })

    
  });

  it("should return a failed transaction because the string has not been translated", async () => {
    const translationInstance = await TranslationContract.deployed();
    const result = await translationInstance.getTranslatedString.call(0);
    
    console.log (result);
  });





  it("should return the translated string", async () => {
    const translationInstance = await TranslationContract.deployed();

    await translationInstance.performTranslation("Bonjour, comment ça va?", 1);
    const result = await translationInstance.getTranslatedString.call(1);

    console.log(result);

    assert.equal(result,"Bonjour, comment ça va?");

    //This should be in a separate test, but can't get it to run
    //This accepts a URL to store in IPFS, then calls a solidity function to store within contract
    const storeContent = async (url) => {
      ipfs.add(new Buffer(url), (err, result) => {
          if (err) {
              console.error("Content submission error:", err);
              return false;
          } else if (result && result[0] && result[0].hash) {
              console.log("Content successfully stored. IPFS address:", result[0].hash);
              
              //make contract calls to 1. store, and 2. retrieve the hash
              translationInstance.storeIPFSAddress(result[0].hash);
              translationInstance.getIPFSAddress()
              .then(function(x) {
              console.log("hash retrieved from Ethereum: " + x);  
            })
            
          } else {
              console.log(result);
              console.error("Unresolved content submission error");
              return null;
          }
      });
    }

    storeContent("testing");

  })

  it("should return the URL given to IPFS"), async () => {
    const translationInstance = await TranslationContract.deployed();

  }
});

