import initContract from "truffle-contract";
import TranslationContract from "../contracts/TranslationContract.json";



// Promisify web3.eth.getAccounts
const getAccounts = web3 =>
  new Promise((resolve, reject) => {
    web3.eth.getAccounts(
      (error, accounts) => (error ? reject(error) : resolve(accounts))
    );
  });

// Uses web3 to get contract instance
const getTranslationInstance = async web3 => {
  // Initiate contract
  const translation = initContract(TranslationContract);
  translation.setProvider(web3.currentProvider);

  // Get instance
  const instance = await translation.deployed();
  return instance;
};

export { getAccounts, getTranslationInstance };
