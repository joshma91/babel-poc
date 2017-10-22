import React, { Component } from "react";
import "./App.css";

// Import utils
import getWeb3 from "./utils/getWeb3";
import {
  getAccounts,
  getTranslationInstance,
} from "./utils/translationContract";

// Import action components
import CreateRequest from "./components/CreateRequest";
import ListOpenRequests from "./components/ListOpenRequests";

class App extends Component {
  state = { web3: null, contractInstance: null, accounts: null };

  componentWillMount = async () => {
    try {
      const web3 = await getWeb3();
      const contractInstance = await getTranslationInstance(web3);
      const accounts = await getAccounts(web3);

      this.setState({ web3, contractInstance, accounts });
    } catch (error) {
      alert(`Error finding web3.`, error);
      console.log(error);
    }
  };

  renderActions = () => {
    const { web3, contractInstance, accounts } = this.state;
    return (
      <div>
        <CreateRequest
          account={accounts[0]}
          contractInstance={contractInstance}
        />
        <ListOpenRequests web3={web3} contractInstance={contractInstance} />
        <div>
          <h2>3. Fulfill a translation request.</h2>
        </div>
        <div>
          <h2>4. Request my own fulfilled translation.</h2>
        </div>
      </div>
    );
  };

  render() {
    const { web3, contractInstance, accounts } = this.state;
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
        </div>
        {ready ? this.renderActions() : null}
      </div>
    );
  }
}

export default App;
