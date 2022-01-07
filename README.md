# Run Your Own Ethereum Indexer

Run your own simple Ethereum indexer implementation, indexing events emitted by smart contracts off-chain.

**What is the purpose of this?** indexing smart contracts data off-chain could enable us to do more complex queries to the data and also process them without depending on the contracts' implementation. On top of that, accessing data directly via calls to the smart contracts might not offer the ideal performance for your application needs.

This project is a simple exploration of how we might index the data, made as straightforward as possible.

For this demo, we will be using `DummyExchange`, a simple contract that will emit `Transaction` event every time we call `DummyExchange.transact()`. The event's spec is defined below:

```
event Transaction(address buyer, string currency, string amount);
```

We will create a corresponding data model to model the `Transaction` events and store them locally in an in-memory sqlite instance. We will listen to the events emitted by the smart contracts and insert the event to our local db, which we could query later on.

## Requirements
1. `node js (tested on v16.13.1)`
2. `npx`

## Installation
```
npm install
```

## Usage

#### Deploy `DummyExchange` to hardhat local network.

```
# run local network
npx hardhat node
# deploy to local network
npx hardhat run --network localhost scripts/deploy.js
```

NOTE: after deploying the contracts, the deployment info (deployed contract address, etc) will be stored in `deployment-info.json`.

#### Simulate indexer

Assuming you have deployed the contracts.

***Step 1:*** run sample server

This script will initialize the local in-memory DB and listen to new events from the deployed `DummyExchange` contract. Run this command to run the server:

```
node scripts/server.js
```

***Step 2:*** run call transactions

This will create new transactions to `DummyExchange`, which will be listened to and processed by `scripts/server.js`. In a separate terminal tab/window, run this command:

```
node scripts/call-transactions.js
```

If you look at `scripts/server.js`'s output, you should be able to see something like this.

```
Aggregated transactions data:
{
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8": {
    "ETH": 2,
    "YFI": 1,
    "GRT": 1
  },
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266": {
    "GRT": 3,
    "ETH": 2,
    "YFI": 2
  }
}
```

This shows that the events were listened to and indexed by the server and the server outputs the aggregated indexed data. In the above's example, we can see that the user with address "0x709..." has 2 `ETH` transactions, 1 `YFI` transaction, and 1 `GRT` transaction (which we indexed in our server!).

## Run tests
```
npx hardhat test
```
