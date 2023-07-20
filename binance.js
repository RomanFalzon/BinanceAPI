const axios = require('axios');

let startTimeStamp = 1672531200000; // Unix GMT UTC
let myNewDate = 0;

let mySymbolData = 'BTCUSDT';
let myIntervalData = '15m';

let myData = []

async function fetchData(loopCount, url) {
  try {
    let url = `https://api.binance.com/api/v3/klines?symbol=${mySymbolData}&interval=${myIntervalData}&startTime=${startTimeStamp}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }
}

async function looper(){

}


async function getBTC(){

}

async function getETH(){
    
}

async function mainTEST() {

    for(i = 0; i<4; i++){

        myNewData = await fetchData(); //get the response
        

        myData = [...myData, ...myNewData]

        myNewDate = myData[myData.length-1][6]
        startTimeStamp = myNewDate

        console.log(startTimeStamp)
    }

    console.log(myData.length)

}



module.exports = { getBTC, getETH, mainTEST};