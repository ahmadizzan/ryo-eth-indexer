const { ethers } = require("ethers");
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const DUMMY_EXCHANGE_JSON = require(__dirname + '/../artifacts/contracts/DummyExchange.sol/DummyExchange.json');
const DUMMY_EXCHANGE_ABI = DUMMY_EXCHANGE_JSON.abi;

const DEPLOYMENT_INFO = require(__dirname + '/../deployment-info.json');
const DUMMY_EXCHANGE_ADDRESS = DEPLOYMENT_INFO.dummyExchange;

// Define model schema
class Transaction extends Model {}
Transaction.init({
  // TODO: add event unique identifier
  buyer: DataTypes.STRING,
  currency: DataTypes.STRING,
  amount: DataTypes.STRING
}, { sequelize, modelName: "transaction" });

async function initDb() {
    await sequelize.sync();
}

async function initPopulateData() {
    // TODO query past events
}

async function init() {
    await initDb();
    await initPopulateData();
}

function listenForNewEvents(dummyExchange) {
    dummyExchange.on("Transaction", async (_buyer, _currency, _amount) => {
        console.log("NEW EVENT - Transaction:", _buyer, _currency, _amount);
        await Transaction.create({
            buyer: _buyer,
            currency: _currency,
            amount: _amount
        });
    })
}

async function aggregateMetrics() {
    const transactions = await Transaction.findAll();
    const data = {}; // buyer => (currency => num_of_currency_transactions)
    for (const tx of transactions) {
        if (!(tx.buyer in data)) {
            data[tx.buyer] = {}
        }
        if (!(tx.currency in data[tx.buyer])) {
            data[tx.buyer][tx.currency] = 1;
        } else {
            data[tx.buyer][tx.currency]++;
        }
    }
    console.log('Aggregated transactions data:');
    console.log(JSON.stringify(data, null, 2));
}

(async () => {
    await init();

    // We first initialize ethers by creating a provider using our local node
    const provider = new ethers.providers.JsonRpcProvider();

    const signer = provider.getSigner(0);
    console.log('Signer address:', await signer.getAddress());

    // Initialize contracts
    const dummyExchange = new ethers.Contract(
        DUMMY_EXCHANGE_ADDRESS,
        DUMMY_EXCHANGE_ABI,
        signer
    );

    // Listen and handle new events
    listenForNewEvents(dummyExchange);

    // TODO: add API to query indexed events
    setInterval(async () => {
        await aggregateMetrics();
    }, 5000);
})();