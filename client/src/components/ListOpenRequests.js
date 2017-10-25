import React from "react";

export default class extends React.Component {
  state = { openRequestStrings: [] };

  getOpenRequests = async () => {
    const { contractInstance, web3 } = this.props;
    const result = await contractInstance.getAllOpenRequests.call();
    const openRequestIds = result.map(x => x.toNumber());
    // const str1 = await contractInstance.getRequestString(0);
    // const str2 = await contractInstance.getRequestString(1);
    let openRequestStrings = [];

    for (let i=0; i<openRequestIds.length; i++){
      const temp = await contractInstance.getRequestString(openRequestIds[i]);
      openRequestStrings.push(temp);
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
