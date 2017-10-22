import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import getWeb3 from "./utils/getWeb3";
import {
  getAccounts,
  getTranslationInstance,
} from "./utils/translationContract";

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
      console.log(error)
    }
  };

  render() {
    const { web3, contractInstance, accounts } = this.state;
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
      </div>
    );
  }
}

export default App;
