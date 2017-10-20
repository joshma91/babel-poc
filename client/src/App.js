import React, { Component } from "react";
import initContract from 'truffle-contract'
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";

import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null };

  componentWillMount = async () => {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    try {
      const result = await getWeb3();
      this.setState({ web3: result.web3 });
      this.instantiateContract();
    } catch (error) {
      console.log(`Error finding web3.`, error);
    }
  };

  instantiateContract() {
    // Initial contract object.
    const simpleStorage = initContract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Get accounts.
    this.state.web3.eth.getAccounts(async (error, accounts) => {
      const simpleStorageInstance = await simpleStorage.deployed();

      // Stores a given value, 5 by default.
      await simpleStorageInstance.set(5, { from: accounts[0] });

      // Get the value from the contract to prove it worked.
      const result = await simpleStorageInstance.get.call({ from: accounts[0] });

      // Update state with the result.
      this.setState({ storageValue: result.c[0] });
    });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            Truffle Box
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>
                If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).
              </p>
              <p>
                Try changing the value stored on
                {` `}
                <strong>line 59</strong>
                {` `}
                of App.js.
              </p>
              <p>The stored value is: {this.state.storageValue}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
