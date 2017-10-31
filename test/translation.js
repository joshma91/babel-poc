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
  const buf = new Buffer(hash_hex.replace(/^0x/, '1220'), 'hex')
  return bs58.encode(buf)
}

contract("TranslationContract", accounts => {
  const [joshs_address, marys_address, franks_address] = accounts;
  const Languages = { English: 1, Spanish: 2, Chinese: 3, French: 4 };

  it("should return the string to be translated", async () => {
    const translationInstance = await TranslationContract.deployed();
    
    const newTranslation = async (obj) => {

      //Adding string to IPFS 
      ipfs.add(new Buffer(obj.string), (err, result) => {
          if (err) {
              console.error("Content submission error:", err);
              return false;
          } else if (result && result[0] && result[0].hash) {
              console.log("Successful request. IPFS address:", result[0].hash);
              //make contract calls to store the IPFS hash in Bytes32
              translationInstance.newTranslation(
                ipfsHashToBytes32(result[0].hash),
                obj.from,
                obj.to,
                obj.data
              );
              console.log( ipfsHashToBytes32(result[0].hash));

          } else {
              console.log(result);
              console.error("Unresolved content submission error");
              return null;
          }
      });
    }

    const firstRequest =  {
      string: "asdfa", 
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

    const arrayOfIds = await translationInstance.getAllOpenRequests.call();
    const requestHash = await translationInstance.getRequestHash(arrayOfIds[1]);

    console.log("trying to get my string back. Hash is: " + requestHash)
   
    //convert to form consumable by IPFS
    const bytes32toIPFS = bytes32ToIPFSHash(requestHash);

    //grab the request string from IPFS
   await ipfs.cat(bytes32toIPFS, {buffer:true}).then(function(res){
      console.log("hello there! " + res);
      assert.equal(res.toString(), "Hi, how are you?");
      
    })
  });

  it("should return a failed transaction because the string has not been translated", async () => {
    const translationInstance = await TranslationContract.deployed();
    const badHash = await translationInstance.getTranslatedHash(0);
    console.log(bytes32ToIPFSHash(badHash));
    assert.equal(parseInt(badHash),0);
  });

  it("should return the translated string", async () => {
    const translationInstance = await TranslationContract.deployed();

    const performTranslation = async (obj) => {
      //add translation to IPFS and existing Translation object
      ipfs.add(new Buffer(obj.string), (err, result) => {
          if (err) {
              console.error("Content submission error:", err);
              return false;
          } else if (result && result[0] && result[0].hash) {
              console.log("Successful translation. IPFS address:", result[0].hash);

              //make contract calls to store the IPFS hash in Bytes32
              translationInstance.performTranslation(
                ipfsHashToBytes32(result[0].hash),
                obj.translationID,
              );  

          } else {
              console.log(result);
              console.error("Unresolved content submission error");
              return null;
          }
      });
    }

    const translation =  {
      string: "Bonjour, comment ça va?", 
      translationID: 1,
    };
    await performTranslation(translation);
    
    //remove this eventually - IPFS for some reason requires some delay in retrieving objects, so this dummy function call is here
    const tmp = await translationInstance.getTmp(1);

    const transHash = await translationInstance.getTranslatedHash(1);

    const bytes32toIPFS = bytes32ToIPFSHash(transHash);
    
    console.log(transHash);
  
    //retrieve translated string from IPFS
    await ipfs.cat(bytes32toIPFS, {buffer:true}).then(function(res){
      console.log("This is the translated string: " + res);
      assert.equal(res.toString(), "Bonjour, comment ça va?");  
    }) 
  });
});

