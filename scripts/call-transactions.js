const { ethers } = require("ethers");
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const DUMMY_EXCHANGE_JSON = require(__dirname + '/../artifacts/contracts/DummyExchange.sol/DummyExchange.json');
const DUMMY_EXCHANGE_ABI = DUMMY_EXCHANGE_JSON.abi;

const DEPLOYMENT_INFO = require(__dirname + '/../deployment-info.json');
const DUMMY_EXCHANGE_ADDRESS = DEPLOYMENT_INFO.dummyExchange;

function generateRandomTransactionData(users, currencies, amounts) {
    const user = users[Math.floor(Math.random() * users.length)];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    return { user, currency, amount };
}

(async () => {
    // We first initialize ethers by creating a provider using our local node
    const provider = new ethers.providers.JsonRpcProvider();

    const user1 = await provider.getSigner(0);
    const user2 = await provider.getSigner(1);
    console.log('User1 address:', await user1.getAddress());
    console.log('User2 address:', await user2.getAddress());

    const users = [user1, user2];
    const currencies = ['ETH', 'GRT', 'YFI'];
    const amounts = ['0.1', '0.2', '0.3'];

    // Initialize contracts
    const dummyExchange = new ethers.Contract(
        DUMMY_EXCHANGE_ADDRESS,
        DUMMY_EXCHANGE_ABI,
        user1
    );

    const numTransactions = 10;
    for (let i = 0; i < numTransactions; i++) {
        const { user, currency, amount } = generateRandomTransactionData(users, currencies, amounts);
        console.log(await user.getAddress(), currency, amount);
        const tx = await dummyExchange.connect(user).transact(currency, amount);
        await tx.wait();
    }
})();