import React from "react";
import LANG from "../utils/languages.json";

export default class extends React.Component {
  state = {
    translationStr: "",
    from: LANG.EN.code,
    to: LANG.FR.code,
    bounty: 10,
  };

  handleInputChange = e => this.setState({ translationStr: e.target.value });
  handleFromChange = e => this.setState({ from: e.target.value });
  handleToChange = e => this.setState({ to: e.target.value });
  handleBountyChange = e => this.setState({ bounty: e.target.value });

  handleSubmit = async () => {
    const { account, contractInstance } = this.props;
    const { translationStr, from, to, bounty } = this.state;

    if (translationStr.trim().length === 0) {
      alert('Please enter in some text to translate.')
      return;
    }

    try {
      await contractInstance.newTranslation(
        translationStr,
        LANG[from].number,
        LANG[to].number,
        { from: account, value: bounty, gas: 300000 }
      );
      alert("Submission successful!");
    } catch (error) {
      alert("An error has occured", error);
      console.log(error);
    }
  };

  render() {
    const { translationStr, from, to, bounty } = this.state;
    return (
      <div>
        <h2>1. Create a new translation request.</h2>

        <div>
          <label>Text to translate</label>
          <input
            type="text"
            value={translationStr}
            onChange={this.handleInputChange}
          />
        </div>

        <div>
          <label>From</label>
          <select value={from} onChange={this.handleFromChange}>
            <option value="EN">{LANG.EN.label}</option>
            <option value="ES">{LANG.ES.label}</option>
            <option value="ZH">{LANG.ZH.label}</option>
            <option value="FR">{LANG.FR.label}</option>
          </select>

          <label>To</label>
          <select value={to} onChange={this.handleToChange}>
            <option value="EN">{LANG.EN.label}</option>
            <option value="ES">{LANG.ES.label}</option>
            <option value="ZH">{LANG.ZH.label}</option>
            <option value="FR">{LANG.FR.label}</option>
          </select>
        </div>

        <div>
          <label>Bounty</label>
          <input
            type="number"
            value={bounty}
            onChange={this.handleBountyChange}
          />
        </div>

        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}
