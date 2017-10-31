import React, { Component } from "react";
import "./App.css";
import ipfsAPI from "ipfs-api";

// Import utils
import getWeb3 from "./utils/getWeb3";
import {
  getAccounts,
  getTranslationInstance
} from "./utils/translationContract";

// Import action components
import CreateRequest from "./components/CreateRequest";
import ListOpenRequests from "./components/ListOpenRequests";
import FulfillRequests from "./components/FulfillRequest";

class App extends Component {
  state = { web3: null, contractInstance: null, accounts: null, ipfs: null};  

  componentWillMount = async () => {
    try {
      const web3 = await getWeb3();
      const contractInstance = await getTranslationInstance(web3);
      const accounts = await getAccounts(web3);
      
      const ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})
      ipfs.swarm.peers(function (err, res) {
        if (err) {
            console.error(err);
        } else {
          const numPeers = res === null ? 0 : res.length;
          console.log("IPFS - connected to " + numPeers + " peers");
        }
    });

      this.setState({ web3, contractInstance, accounts, ipfs });
    } catch (error) {
      alert(`Error finding web3.`, error);
      console.log(error);
    }
  };

  renderActions = () => {
    const { web3, contractInstance, accounts, ipfs } = this.state;
    return (
      <div>
        <CreateRequest
          account={accounts[0]}
          contractInstance={contractInstance}
          ipfs = {ipfs}
        />
        <ListOpenRequests web3={web3} contractInstance={contractInstance}  ipfs = {ipfs}/>
        <FulfillRequests />
        <div>
          <h2>4. Inspect my own fulfilled translation.</h2>
        </div>
      </div>
    );
  };

  render() {
    const { web3, contractInstance, accounts, ipfs } = this.state;
    const ready = web3 && contractInstance && accounts;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Babel-PoC</h1>
        </header>
        <div>
          <h2>Ready State</h2>
          <div>web3: {Boolean(web3).toString()}</div>
          <div>contractInstance: {Boolean(contractInstance).toString()}</div>
          <div>accounts: {Boolean(accounts).toString()}</div>
          <div>ipfs: {Boolean(ipfs).toString()}</div>
        </div>
        {ready ? this.renderActions() : null}
      </div>
    );
  }
}

export default App;
