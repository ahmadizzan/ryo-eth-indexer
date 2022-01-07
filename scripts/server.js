const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

// Define model schema
class Transaction extends Model {}
Transaction.init({
  buyer: DataTypes.STRING,
  currency: DataTypes.STRING,
  amount: DataTypes.STRING,
}, { sequelize, modelName: "transaction" });

async function initDb() {
    await sequelize.sync();
}

async function initPopulateData() {
    await Transaction.create({
        buyer: "0x01",
        currency: "eth",
        amount: "0.1"
    });
    await Transaction.create({ 
        buyer: "0x02",
        currency: "grt",
        amount: "0.3"
    });
    // TODO query past events
}

async function init() {
    await init();
    await initPopulateData();
}

(async () => {
    await init();

    const transactions = await Transaction.findAll();
    console.log("Transactions:")
    console.log("===============")
    for (const tx of transactions) {
        console.log(tx.buyer, tx.currency, tx.amount)
    }

    // TODO: add listener to new events

    // TODO: add API to query on top of this
})();