# babel-poc

A dApp allowing for strings to be translated by other users. 

## Installation

Install Truffle and an Ethereum Client. For local development, EthereumJS TestRPC is recommended

```
npm install -g truffle // Version 3.0.5+ required.
npm install -g ethereumjs-testrpc
```

Compile and migrate the contracts (to the testRPC in this case).

```
truffle compile
truffle migrate
```
Install node dependencies and run

```
cd client
npm install
npm run start
```

To build the dApp for production, run the build command. The build will be in the client/build_webpack folder

```
npm run build
```
