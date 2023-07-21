const myAPI = require('./binance');
const dbfilePath = './db/db.json';
const fs = require('fs');


let myLiveData = []
let myDate = 1684674037



async function main() {
    try {
        myLiveData = await myAPI.getCandles('BTC', '1h', '01-01-2023 00:00:00');
        myDate = myLiveData[myLiveData.length-1][6]

        console.log(myLiveData)
        await saveToJson(myLiveData);
    } catch (error) {
        console.error('Error:', error.message);
    }
}


async function saveToJson(data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(dbfilePath, jsonData);
        console.log('Data saved to db.json successfully.');
    } catch (error) {
        console.error('Error saving data to db.json:', error.message);
    }
}

main();

