const express = require('express');
const myAPI = require('./binance');

const myBot = require('./backTestingBot.js');


const fs = require('fs');

const app = express();
const port = 3000; 


let myDate = Date.now() -100000; //'07-21-2023 00:00:00'

let myBeforeDate = [];
let myNowDate = [];

let myTotalArray = [];

let myInterval = '1m'

async function fetchData() {
    try {
        if(myBeforeDate.length === 0){
            console.log('calling Old Data Init: ')

            myBeforeDate = await myAPI.getCandles('BTC', myInterval, myDate);
            myAPI.clearCandles()

        }
        


        myNowDate = await myAPI.getCandles('BTC', myInterval, myDate);
        myAPI.clearCandles()

        console.log('calling Data--- ')
        
        console.log('PREVIOUS STICK DATE: ', myBeforeDate[myBeforeDate.length - 1][0])
        console.log('CURRENT STICK DATE: ', myNowDate[myNowDate.length-1][0])




        if(myNowDate[myNowDate.length-1][0] !== myBeforeDate[myBeforeDate.length-1][0]){ // NEW STICK - UPDATE STUFF

            console.log('CCHANGE OF DATE: NEW STICK MADE---')

            myBeforeDate = myNowDate; // Update old array with new start stick
            myDate = myNowDate[myNowDate.length-1][0]

            myTotalArray = [...myTotalArray, ...myNowDate]

            //console.log(myTotalArray)
        }

    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}




// Initial data fetch
fetchData();

// Schedule data fetch every 10 seconds
const interval = 5000; // 10 seconds in milliseconds
setInterval(fetchData, interval);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});