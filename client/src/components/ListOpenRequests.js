import React from "react";
import {
  ipfsHashToBytes32, 
  bytes32ToIPFSHash,
} from "../utils/hashUtils.js";

export default class extends React.Component {
  state = { openRequestObjects: [] };
  
  handleInputChange = (id,e) => {
    const requests = this.state.openRequestObjects;
    requests[id].translation = e.target.value;
    this.setState({
      openRequestObjects : requests
    });
    this.state.openRequestObjects[id].translation = e.target.value; 
    console.log(this.state.openRequestObjects[id]);
    // console.log(this.state);
  }

  handleSubmit = async (id) => {
    const { account, contractInstance, ipfs } = this.props;
    const { openRequestObjects } = this.state;

    const translationObj = openRequestObjects[id];

    console.log(translationObj.translation);
    if (!translationObj.translation || translationObj.translation.trim().length === 0) {
      alert('Please enter a translation.')
      return;
    } 

    const submitTranslation = async (obj) => {
      try {
        const result = await ipfs.add(new Buffer(obj.string));
        if (result && result[0] && result[0].hash) {
          console.log("Successful translation. IPFS address:", result[0].hash);

          //make contract calls to store the IPFS hash in Bytes32
          await contractInstance.performTranslation(
            ipfsHashToBytes32(result[0].hash),
            obj.id,
            {from: account}
          );
        }
      } catch (error) {
        alert('Error submitting translation', error);
        console.log(error);
      }
    }

    try {
      await submitTranslation({
        string: translationObj.translation,
        id: translationObj.id,
        data: { from: account, gas: 300000 }
      }) 
      alert("Submission successful!");
    } catch (error) {
      alert("An error has occured", error);
      console.log(error);
    }
  }

  getOpenRequests = async () => {
    const { account, contractInstance, ipfs } = this.props;
    
    const result = await contractInstance.getAllOpenRequests();
    const openRequestIds = result.map(x => x.toNumber());
    console.log(openRequestIds);

    let openRequestObjects = [];

    for (let i=0; i<openRequestIds.length; i++){
      const requestHash = await contractInstance.getRequestHash(openRequestIds[i]);

      const bytes32toIPFS = bytes32ToIPFSHash(requestHash);
      
      await ipfs.cat(bytes32toIPFS, {buffer:true}).then(function(res){
        openRequestObjects.push({id: openRequestIds[i], req: res.toString()});
      })
    }
    console.log(openRequestObjects)
    this.setState({ openRequestObjects });
  };

  render() {
    const { openRequestObjects } = this.state;
    return (
      <div>
        <h2>2. List all open translation requests.</h2>
        <button onClick={this.getOpenRequests}>Get Open Requests</button>
        {this.state.openRequestObjects
          ? <tbody>{this.state.openRequestObjects.map(x => <tr key={x.id}>
            <td>{x.req}</td>
            <td> 
              <input
                type="text"
                onChange={this.handleInputChange.bind(this, x.id)}/> 
            </td>
            <td> <button onClick={this.handleSubmit.bind(this, x.id)}>Translate!</button> </td>
          </tr>)}</tbody>
          : null}
      </div>
    );
  }
}
