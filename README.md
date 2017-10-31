# babel-poc

A dApp allowing for strings to be translated by other users. 

## Installation

### Install IPFS

__Mac/Linux:__ For Mac and Linux users, download the [prebuilt package](https://ipfs.io/docs/install/), then untar and move the binary to your executables `$PATH` as follows:
```
tar xvfz go-ipfs.tar.gz
mv go-ipfs/ipfs /usr/local/bin/ipfs
```

__Windows:__ For Windows users, download the [prebuilt package](https://ipfs.io/docs/install/), then unzip and move `ipfs.exe` to your `%PATH%`.

To test that your IPFS installation worked, in your terminal (Mac/Linux) or command prompt (Windows) window, run:
```
ipfs help
```
The help menu describing IPFS actions will be printed out.

## Initialize IPFS

Now that IPFS is installed, let's setup IPFS. Start by initializing IPFS and modifying CORS restrictions:
```
ipfs init
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
```

Now start the daemon:
```
ipfs daemon
```

### Install Truffle & TestRPC

Install Truffle and an Ethereum Client. For local development, EthereumJS TestRPC is recommended

```
npm install -g truffle // Version 3.0.5+ required.
npm install -g ethereumjs-testrpc
```

In a new terminal window, start the testRPC. This emulates a local Ethereum node for development.

```
testrpc
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
