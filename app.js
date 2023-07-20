
const myAPI = require('./binance')


myAPI.getCandles('BTC', '15m', '07-19-2023 00:00:00').then((myDT) => {
    console.log(myDT);
}).catch((error) => {
    console.error('Error:', error.message);
});