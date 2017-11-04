var toAscii = require("./utils");
var ipfsAPI = require('ipfs-api');
var bs58 = require('bs58')

const TranslationContract = artifacts.require("./TranslationContract.sol");

/* Configuration variables */
const ipfsHost    = 'localhost';
const ipfsAPIPort = '5001';
const ipfsWebPort = '8080';
const ipfsAddress = "http://" + ipfsHost + ':' + ipfsWebPort + "/ipfs";

const ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

// /* IPFS initialization */
ipfs.swarm.peers(function (err, res) {
  if (err) {
      console.error(err);
  } else {
    const numPeers = res === null ? 0 : res.length;
    console.log("IPFS - connected to " + numPeers + " peers");
  }
});

//following 2 functions needed to store/retrieve IPFS hash to/from bytes32
function ipfsHashToBytes32(ipfs_hash) {
  const h = bs58.decode(ipfs_hash).toString('hex').replace(/^1220/, '');
  if (h.length != 64) {
      console.log('invalid ipfs format', ipfs_hash, h);
      return null;
  }
  return '0x' + h;
}

function bytes32ToIPFSHash(hash_hex) {
  const buf = new Buffer(hash_hex.toString('hex').replace(/^0x/, '1220'), 'hex')
  return bs58.encode(buf)
}

//storeData allows for 
const storeData = async (obj, instance, isRequest) => {
  
  //Adding string to IPFS 
  const result = await ipfs.add(new Buffer(obj.string));
  if(result && result[0] && result[0].hash) {
    console.log("Successful request. IPFS address:", result[0].hash);
    //make contract calls to store the IPFS hash in Bytes32
    if (isRequest) { 
        instance.newTranslation(
        ipfsHashToBytes32(result[0].hash), 
        obj.from, 
        obj.to, 
        obj.data
      );
    } else {
        instance.performTranslation(
        ipfsHashToBytes32(result[0].hash),
        obj.translationID,
      );  
    }
    console.log(ipfsHashToBytes32(result[0].hash));
  }
} 
   
const retrieveString = async (hash) => {
  const res = await ipfs.cat(hash, {buffer:true});
  console.log("This is the string: " + res);
  return res;
} 

contract("TranslationContract", accounts => {
  const [joshs_address, marys_address, franks_address] = accounts;
  const Languages = { English: 1, Spanish: 2, Chinese: 3, French: 4 };

  it("should return the string to be translated", async () => {
    const translationInstance = await TranslationContract.deployed();
  
    const firstRequest =  {
      string: "asdfa", 
      from: Languages.English, 
      to: Languages.French, 
      data: {from: joshs_address, value: 10 }};

    await storeData(firstRequest, translationInstance, true);

    const secondRequest = {
      string: "Hi, how are you?",
      from: Languages.English,
      to: Languages.French,
      data: {from: joshs_address, value: 10 }};
    
    await storeData(secondRequest, translationInstance, true);

    const arrayOfIds = await translationInstance.getAllOpenRequests.call();
    console.log(arrayOfIds);
    const requestHashInBytes32 = await translationInstance.getRequestHash(arrayOfIds[1]);

    console.log("trying to get my string back. Hash is: " + requestHashInBytes32)
   
    //convert to form consumable by IPFS
    const requestHash = bytes32ToIPFSHash(requestHashInBytes32);

    //grab the request string from IPFS
    const res = await retrieveString(requestHash);
    assert.equal(res, "Hi, how are you?");
  });

  it("should return a failed transaction because the string has not been translated", async () => {
    const translationInstance = await TranslationContract.deployed();
    const badHash = await translationInstance.getTranslatedHash(0);
    console.log(bytes32ToIPFSHash(badHash));
    assert.equal(parseInt(badHash),0);
  });

  it("should return the translated string", async () => {
    const translationInstance = await TranslationContract.deployed();

    const translation =  {
      string: "Bonjour, comment ça va?", 
      translationID: 1,
    };

    await storeData(translation, translationInstance, false);
    
    //remove this eventually - IPFS for some reason requires some delay in retrieving objects, so this dummy function call is here

    const transHashInBytes32 = await translationInstance.getTranslatedHash(1);

    const transHash = bytes32ToIPFSHash(transHashInBytes32);
    
    console.log(transHash);

    //retrieve translated string from IPFS
    const res = await retrieveString (transHash);
    assert.equal(res, "Bonjour, comment ça va?"); 
  });
});

