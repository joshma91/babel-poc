import React from "react";

export default class extends React.Component {
  state = { translationStr: `` };

  handleInputChange = e => this.setState({ translationStr: e.target.value });

  handleSubmit = async () => {
    const { translationInstance, accounts } = this.props;
    const { translationStr } = this.state;
    await translationInstance.requestTranslation(translationStr, 1, 1, {
      from: accounts[0],
      value: 10,
      gas: 300000,
    });
    alert(`Request successfully submitted: ${translationStr}`);
  };

  render() {
    return (
      <div>
        <h2>Request a Translation</h2>
        <p>This is how you would request a translation.</p>
        <input
          type="text"
          value={this.state.translationStr}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleSubmit}>Submit Request</button>
      </div>
    );
  }
}
