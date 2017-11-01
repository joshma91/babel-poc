import React from "react";
import {
  ipfsHashToBytes32, 
  bytes32ToIPFSHash,
} from "../utils/hashUtils.js";

export default class extends React.Component {
  state = { openRequestStrings: [] };

  getOpenRequests = async () => {
    const { contractInstance, web3, ipfs } = this.props;
    const result = await contractInstance.getAllOpenRequests();
    const openRequestIds = result.map(x => x.toNumber());
    console.log(openRequestIds);

    let openRequestStrings = [];

    for (let i=0; i<openRequestIds.length; i++){
      const requestHash = await contractInstance.getRequestHash(openRequestIds[i]);
      console.log(requestHash)

      const bytes32toIPFS = bytes32ToIPFSHash(requestHash);
      
      console.log(bytes32toIPFS);
      
      await ipfs.cat(bytes32toIPFS, {buffer:true}).then(function(res){
        openRequestStrings.push(res.toString());
      })
    }

    console.log('hey')
    console.log(openRequestStrings)
    this.setState({ openRequestStrings });
  };

  render() {
    return (
      <div>
        <h2>2. List all open translation requests.</h2>
        <button onClick={this.getOpenRequests}>Get Open Requests</button>
        {this.state.openRequestStrings
          ? <ul>{this.state.openRequestStrings.map(x => <li>{x}</li>)}</ul>
          : null}
      </div>
    );
  }
}
