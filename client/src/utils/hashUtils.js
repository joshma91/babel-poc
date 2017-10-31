import bs58 from "bs58";

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

export {ipfsHashToBytes32, bytes32ToIPFSHash} 