import React from "react";
import {
  ipfsHashToBytes32, 
  bytes32ToIPFSHash,
} from "../utils/hashUtils.js";


export default class extends React.Component {
    state = { fulfilledRequestObjects: []};

    getMyRequests = async () => {
      const { account, contractInstance, ipfs }  = this.props;
      const result = await contractInstance.getRequestIDsByAddress(account);
      const requestIds = result.map(x => x.toNumber());
      console.log(requestIds);

      //TODO: we'll want to change this to the actual Translation object
      let fulfilledRequestObjects = [];
      for(let i=0; i<requestIds.length; i++){
        const transHash = await contractInstance.getTranslatedHash(requestIds[i])
        ;
        const bytes32toIPFS = bytes32ToIPFSHash(transHash);
        console.log(bytes32toIPFS);

        //this is the hash for a null entry (i.e. not translated)
        //we won't want to retrieve this
        //TODO: find a more elegant way to do this
        if(bytes32toIPFS != "QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51"){
          await ipfs.cat(bytes32toIPFS, {buffer:true}).then(function(res){
            fulfilledRequestObjects.push({id: requestIds[i], str: res.toString()});
          })
        }
      }
      console.log(fulfilledRequestObjects)
      this.setState({ fulfilledRequestObjects });
    }
    
    render() {
      return (
        <div>
          <h2>3. View my fulfilled translations</h2>
          <button onClick={this.getMyRequests}>Get My Requests</button>
          {this.state.fulfilledRequestObjects
          ? <ul>{this.state.fulfilledRequestObjects.map(x => <li>{x.str}</li>)}</ul>
          : null}
        </div>
      );
    } 
  }
  