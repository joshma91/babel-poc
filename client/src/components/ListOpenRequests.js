import React from "react";

export default class extends React.Component {
  state = { openRequests: [] };

  getOpenRequests = async () => {
    const { contractInstance, web3 } = this.props;
    const results = await contractInstance.getAllOpenRequests.call();
    this.setState({ openRequests: results.map(x => x.toNumber())})
  };

  render() {
    return (
      <div>
        <h2>2. List all open translation requests.</h2>
        <button onClick={this.getOpenRequests}>Get Open Requests</button>
        {this.state.openRequests
          ? <ul>{this.state.openRequests.map(x => <li>{x}</li>)}</ul>
          : null}
      </div>
    );
  }
}
