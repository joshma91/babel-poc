import React, { Component } from "react";
import initContract from "truffle-contract";
import TranslationContract from "./contracts/TranslationContract.json";
import getWeb3 from "./utils/getWeb3";
import RequestTranslation from "./components/RequestTranslation";

class App extends Component {
  state = { web3: null, translationInstance: null, accounts: null };

  componentWillMount = async () => {
    try {
      const result = await getWeb3();
      this.setState({ web3: result.web3 });
      this.instantiateContract();
    } catch (error) {
      alert(`Error finding web3.`, error);
    }
  };

  instantiateContract() {
    // Initial contract object.
    const translation = initContract(TranslationContract);
    translation.setProvider(this.state.web3.currentProvider);

    // Get accounts and contract instance.
    this.state.web3.eth.getAccounts(async (error, accounts) => {
      const instance = await translation.deployed();
      this.setState({ translationInstance: instance, accounts });
      console.log(`translationInstance ready`);
    });
  }

  render() {
    const { web3, translationInstance, accounts } = this.state;
    const ready = web3 && translationInstance && accounts;
    if (!ready) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <h1>Babel PoC</h1>
        <p>
          A proof-of-concept for a p2p translation network running on top of the Ethereum blockchain.
        </p>
        <h2>Accounts</h2>
        {
          accounts.map(x => <div>{x}</div>)
        }
        <RequestTranslation
          translationInstance={translationInstance}
          accounts={accounts}
        />
      </div>
    );
  }
}

export default App;
